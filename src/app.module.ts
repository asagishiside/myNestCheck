import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configration from 'config/configration';
import { HttpModule } from '@nestjs/axios';
import { StoresModule } from './stores/stores.module';
import { WeathersModule } from './weathers/weathers.module';
import { GlobalModule } from './global/global.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configration],
      isGlobal: true,
    }),
    HttpModule,
    StoresModule,
    WeathersModule,
    GlobalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
