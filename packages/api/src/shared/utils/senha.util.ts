import * as bcrypt from 'bcrypt';

class SenhaUtil {
    private static readonly COMPLEXIDADE_SALT = process.env.API_SAL || 10;
    private static readonly PEPPER = process.env.API_PIMENTA || 'api-pimenta';
    private static readonly REGEX_SEM_CARACTERES_CONTROLE = /[^\x20-\x7E]/g;

    static async gerarHash(senha: string): Promise<string> {
        if (!senha || senha.trim().length < 6) {
            throw new Error('A senha deve ter no mínimo 6 caracteres');
        }

        const senhaSanitizada = this.normalizar(senha);
        const senhaComPepper = senhaSanitizada + this.PEPPER;

        return bcrypt.hash(senhaComPepper, Number(this.COMPLEXIDADE_SALT));
    }

    static async validarHash(senha: string, hash: string): Promise<boolean> {
        if (!senha || !hash) {
            return false;
        }

        try {
            const senhaSanitizada = this.normalizar(senha);
            const senhaComPepper = senhaSanitizada + this.PEPPER;

            return bcrypt.compare(senhaComPepper, hash);
        } catch (erro: any) {
            return erro;
        }
    }

    private static normalizar(senha: string): string {
        let senhaSanitizada = senha.trim();
        senhaSanitizada = senhaSanitizada.replace(this.REGEX_SEM_CARACTERES_CONTROLE, '');

        if (senhaSanitizada.length > 128) {
            senhaSanitizada = senhaSanitizada.substring(0, 128);
        }

        return senhaSanitizada;
    }
}

export { SenhaUtil };
