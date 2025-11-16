import { AuthModule } from '@auth/auth.module';
import { Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { WOLConnectionController } from '@wol/wol-connection.controller';
import { WOLConnectionService } from '@wol/wol-connection.service';

@Module({
    imports: [
    AuthModule,
    UserModule ],
    controllers: [WOLConnectionController],
    providers: [WOLConnectionService]
})
export class WOLConnectionModule {}