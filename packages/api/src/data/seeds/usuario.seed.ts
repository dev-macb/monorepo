import { Usuario } from '../../modules/usuarios/entities/usuario.entity';
import { Usuarios } from '../../shared/enums/usuarios.enum';
import { SenhaUtil } from '../../shared/utils/senha.util';

const UsuariosSeed = {
    async obter(): Promise<Partial<Usuario>[]> {
        return [
            {
                id: 1,
                tipo: Usuarios.ADMINISTRADOR,
                nomeCompleto: 'Administrador',
                email: 'administrador@email.com',
                senha: await SenhaUtil.gerarHash(process.env.USUARIO_SENHA || 'usuario-senha'),
                ativo: true,
                criadoEm: new Date(),
                atualizadoEm: new Date(),
            },
        ];
    },
};

export { UsuariosSeed };
