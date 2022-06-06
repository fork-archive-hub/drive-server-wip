import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AesService } from './aes.service';
import { CryptoService } from './crypto.service';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [ConfigService, AesService, CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}