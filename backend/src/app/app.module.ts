import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { WOLConnectionModule } from '@wol/wol-connection.module';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { DeviceModule } from '@device/device.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    WOLConnectionModule,
    DeviceModule,
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
