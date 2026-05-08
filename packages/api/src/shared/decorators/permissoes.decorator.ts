import { SetMetadata } from '@nestjs/common';
import { Usuarios } from '../enums/usuarios.enum';

const PUBLICO = 'publico';
const USUARIO_PERMISSOES = 'usuario_permissoes';

const Publico = () => SetMetadata(PUBLICO, true);
const UsuarioPermissoes = (...permissoes: Usuarios[]) => SetMetadata(USUARIO_PERMISSOES, permissoes);

export { Publico, UsuarioPermissoes, PUBLICO, USUARIO_PERMISSOES };
