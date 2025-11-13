import { Module } from '@nestjs/common';
import { WOLConnectionController } from '@wol/wol-connection.controller';
import { WOLConnectionService } from '@wol/wol-connection.service';

@Module({
    controllers: [WOLConnectionController],
    providers: [WOLConnectionService]
})
export class WOLConnectionModule {}