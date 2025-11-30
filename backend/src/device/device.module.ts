import { Module } from '@nestjs/common';
import { DeviceController } from '@device/device.controller';
import { DeviceService } from '@device/device.service';
import { PrismaModule } from '@prisma/prisma.module';
import { DeviceRepository } from './device.repository';
import { UserModule } from '@user/user.module';
import { WOLConnectionService } from '@wol/wol-connection.service';
import { WOLConnectionModule } from '@wol/wol-connection.module';
import { WolGateway } from '@wol/wol.gateway';

@Module({
    imports: [
        PrismaModule,
        UserModule,
        WOLConnectionModule
    ],
    controllers: [DeviceController],
    providers: [WolGateway, WOLConnectionService, DeviceService, DeviceRepository],
    exports: [DeviceService]
})
export class DeviceModule { }
