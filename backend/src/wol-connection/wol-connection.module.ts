import { AuthModule } from '@auth/auth.module';
import { Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { WOLConnectionController } from '@wol/wol-connection.controller';
import { WOLConnectionService } from '@wol/wol-connection.service';
import { WolGateway } from '@wol/wol.gateway';

@Module({
    imports: [
    AuthModule,
    UserModule ],
    controllers: [WOLConnectionController],
    providers: [WOLConnectionService, WolGateway]
})
export class WOLConnectionModule {}