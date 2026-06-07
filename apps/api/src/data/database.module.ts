import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
    providers: [DatabaseService],
    exports: [DatabaseService],
})
class DatabaseModule {}

export { DatabaseModule };
