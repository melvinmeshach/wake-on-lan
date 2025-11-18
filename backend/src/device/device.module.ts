import { Module } from '@nestjs/common';
import { DeviceController } from '@device/device.controller';
import { DeviceService } from '@device/device.service';
import { PrismaModule } from 'prisma/prisma.module';
import { DeviceRepository } from './device.repository';
import { UserModule } from '@user/user.module';

@Module({
    imports: [
        PrismaModule,
        UserModule],
    controllers: [DeviceController],
    providers: [DeviceService, DeviceRepository],
    exports: [DeviceService]
})
export class DeviceModule { }
