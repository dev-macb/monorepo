import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtiquetaController } from './etiqueta.controller';
import { EtiquetaService } from './etiqueta.service';
import { Etiqueta } from './entities/etiqueta.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Etiqueta])],
    controllers: [EtiquetaController],
    providers: [EtiquetaService],
    exports: [EtiquetaService],
})
class EtiquetaModule {}

export { EtiquetaModule };
