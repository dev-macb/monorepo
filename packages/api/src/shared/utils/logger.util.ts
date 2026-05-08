import { LoggerService } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

class LoggerUtil implements LoggerService {
    private readonly CONTEXTO_PADRAO = '*';
    private readonly NIVEL_PADRAO = 'info';
    private readonly REGEX_REGRA = /^contexto=[^;]+;nivel=(trace|debug|info|warn|error)$/;
    private readonly MAPA_NIVEL_LOG: Record<string, number> = {
        trace: 0,
        debug: 1,
        info: 2,
        warn: 3,
        error: 4,
    };

    private static contextoDeRegras: Record<string, number> = {};

    constructor(
        @InjectPinoLogger()
        private readonly pinoLogger: PinoLogger
    ) {
        if (Object.keys(LoggerUtil.contextoDeRegras).length === 0) {
            this.inicializarContextoDeRegras();
        }
    }

    verbose(mensagem: string, contexto?: string) {
        if (this.deveExibirLog('trace', contexto)) {
            this.pinoLogger.trace(this.formatarMensagem(mensagem, contexto));
        }
    }

    debug(mensagem: string, contexto?: string) {
        if (this.deveExibirLog('debug', contexto)) {
            this.pinoLogger.debug(this.formatarMensagem(mensagem, contexto));
        }
    }

    log(mensagem: string, contexto?: string) {
        if (this.deveExibirLog('info', contexto)) {
            this.pinoLogger.info(this.formatarMensagem(mensagem, contexto));
        }
    }

    warn(mensagem: string, contexto?: string) {
        if (this.deveExibirLog('warn', contexto)) {
            this.pinoLogger.warn(this.formatarMensagem(mensagem, contexto));
        }
    }

    error(mensagem: string, stacktrace?: string, contexto?: string) {
        if (this.deveExibirLog('error', contexto)) {
            const mensagemFormatada = this.formatarMensagem(mensagem, contexto);
            if (stacktrace) {
                this.pinoLogger.error({ stacktrace }, mensagemFormatada);
            } else {
                this.pinoLogger.error(mensagemFormatada);
            }
        }
    }

    private formatarMensagem(mensagem: string, contexto?: string): string {
        return contexto ? `[${contexto}] ${mensagem}` : mensagem;
    }

    private inicializarContextoDeRegras(): void {
        const regraDoAmbiente = process.env.LOG_REGRAS;
        if (!regraDoAmbiente) {
            LoggerUtil.contextoDeRegras[this.CONTEXTO_PADRAO] = this.MAPA_NIVEL_LOG[this.NIVEL_PADRAO];
            return;
        }

        const regras = regraDoAmbiente.split('/');
        for (const regra of regras) {
            if (!this.validarRegra(regra)) {
                console.warn(`⚠️ Regra de log ignorada (formato inválido): ${regra}`);
                continue;
            }

            let contexto = this.CONTEXTO_PADRAO;
            let nivel = this.NIVEL_PADRAO;

            const partes = regra.split(';');
            for (const parte of partes) {
                if (parte.startsWith('contexto=')) {
                    contexto = parte.split('=')[1] || contexto;
                } else if (parte.startsWith('nivel=')) {
                    nivel = parte.split('=')[1] || nivel;
                }
            }

            const valorNivelDoLog = this.MAPA_NIVEL_LOG[nivel.trim()] || this.MAPA_NIVEL_LOG[this.NIVEL_PADRAO];

            const contextos = contexto.split(',');
            for (const ctx of contextos) {
                LoggerUtil.contextoDeRegras[ctx.trim()] = valorNivelDoLog;
            }
        }
    }

    private validarRegra(regra: string): boolean {
        if (!regra || regra.trim() === '') {
            return false;
        }
        return this.REGEX_REGRA.test(regra);
    }

    private deveExibirLog(metodo: string, contexto?: string): boolean {
        return this.MAPA_NIVEL_LOG[metodo] >= this.obterNivelDoLog(contexto);
    }

    private obterNivelDoLog(contexto?: string): number {
        contexto = contexto ?? '';

        return LoggerUtil.contextoDeRegras[contexto] ?? LoggerUtil.contextoDeRegras[this.CONTEXTO_PADRAO] ?? this.MAPA_NIVEL_LOG[this.NIVEL_PADRAO];
    }
}

export { LoggerUtil };
