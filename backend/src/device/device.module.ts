import { AuthModule } from '@auth/auth.module';
import { Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { DeviceController } from '@device/device.controller';
import { DeviceService } from '@device/device.service';

@Module({
    imports: [
    AuthModule,
    UserModule ],
    controllers: [DeviceController],
    providers: [DeviceService]
})
export class DeviceModule {}