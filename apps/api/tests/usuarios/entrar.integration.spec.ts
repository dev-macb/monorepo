import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UsuarioController } from '../../src/modules/usuarios/usuario.controller';
import { UsuarioService } from '../../src/modules/usuarios/usuario.service';
import { Usuario } from '../../src/modules/usuarios/entities/usuario.entity';
import { SenhaUtil } from '../../src/shared/utils/senha.util';
import { UsuarioGuard } from '../../src/shared/guards/usuario.guard';
import { UsuarioStrategy } from '../../src/shared/strategies/usuario.strategy';

jest.setTimeout(30000);

describe('POST /usuarios/entrar (Integration)', () => {
    let app: INestApplication;
    let repositorio: Repository<Usuario>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [Usuario],
                    synchronize: true,
                    logging: false,
                }),
                TypeOrmModule.forFeature([Usuario]),
                JwtModule.register({
                    secret: 'test-jwt-secret',
                    signOptions: { expiresIn: '1h' },
                }),
                PassportModule,
            ],
            controllers: [UsuarioController],
            providers: [
                UsuarioService,
                UsuarioGuard,
                UsuarioStrategy,
                {
                    provide: ConfigService,
                    useValue: {
                        getOrThrow: jest.fn((key: string) => {
                            if (key === 'USUARIO_JWT') return 'test-jwt-secret';
                            throw new Error(`Config ${key} nao encontrada`);
                        }),
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
        await app.init();

        repositorio = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () => {
        await repositorio.clear();
        const hash = await SenhaUtil.gerarHash('senha123');
        await repositorio.save({
            nomeCompleto: 'Usuario Teste',
            email: 'teste@email.com',
            senha: hash,
            tipo: 1,
            ativo: true,
        });
    });

    describe('quando credenciais sao validas', () => {
        it('deve retornar 200 e token_usuario', async () => {
            const resposta = await request(app.getHttpServer())
                .post('/usuarios/entrar')
                .send({ email: 'teste@email.com', senha: 'senha123' })
                .expect(200);

            expect(resposta.body).toHaveProperty('token_usuario');
            expect(typeof resposta.body.token_usuario).toBe('string');
        });

        it('deve retornar token JWT valido (3 partes)', async () => {
            const resposta = await request(app.getHttpServer())
                .post('/usuarios/entrar')
                .send({ email: 'teste@email.com', senha: 'senha123' })
                .expect(200);

            const partes = resposta.body.token_usuario.split('.');
            expect(partes).toHaveLength(3);
        });
    });

    describe('quando credenciais sao invalidas', () => {
        it('deve retornar 401 para email inexistente', async () => {
            const resposta = await request(app.getHttpServer())
                .post('/usuarios/entrar')
                .send({ email: 'inexistente@email.com', senha: 'senha123' })
                .expect(401);

            expect(resposta.body.message).toBe('Credenciais inválidas');
        });

        it('deve retornar 401 para senha incorreta', async () => {
            const resposta = await request(app.getHttpServer())
                .post('/usuarios/entrar')
                .send({ email: 'teste@email.com', senha: 'senha-errada' })
                .expect(401);

            expect(resposta.body.message).toBe('Credenciais inválidas');
        });
    });

    describe('quando usuario esta inativo', () => {
        beforeEach(async () => {
            await repositorio.clear();
            const hash = await SenhaUtil.gerarHash('senha123');
            await repositorio.save({
                nomeCompleto: 'Usuario Inativo',
                email: 'inativo@email.com',
                senha: hash,
                tipo: 1,
                ativo: false,
            });
        });

        it('deve retornar 401', async () => {
            const resposta = await request(app.getHttpServer())
                .post('/usuarios/entrar')
                .send({ email: 'inativo@email.com', senha: 'senha123' })
                .expect(401);

            expect(resposta.body.message).toBe('Usuário inativo');
        });
    });

    describe('quando payload e invalido', () => {
        it('deve retornar 400 para email malformatado', async () => {
            await request(app.getHttpServer())
                .post('/usuarios/entrar')
                .send({ email: 'email-invalido', senha: 'senha123' })
                .expect(400);
        });

        it('deve retornar 400 quando corpo esta vazio', async () => {
            await request(app.getHttpServer())
                .post('/usuarios/entrar')
                .send({})
                .expect(400);
        });
    });
});
