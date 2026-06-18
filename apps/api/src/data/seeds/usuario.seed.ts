import { PapelUsuario } from '@monorepo/contracts';
import { Usuario } from '../../modules/usuarios/entities/usuario.entity';
import { SenhaUtil } from '../../shared/utils/senha.util';

const UsuariosSeed = {
    async obter(): Promise<Partial<Usuario>[]> {
        return [
            {
                id: 1,
                tipo: PapelUsuario.ADMINISTRADOR,
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
