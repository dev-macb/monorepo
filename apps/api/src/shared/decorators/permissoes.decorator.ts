import { SetMetadata } from '@nestjs/common';
import { PapelUsuario } from '@monorepo/contracts';

const PUBLICO = 'publico';
const USUARIO_PERMISSOES = 'usuario_permissoes';

const Publico = () => SetMetadata(PUBLICO, true);
const UsuarioPermissoes = (...permissoes: PapelUsuario[]) => SetMetadata(USUARIO_PERMISSOES, permissoes);

export { Publico, UsuarioPermissoes, PUBLICO, USUARIO_PERMISSOES };
