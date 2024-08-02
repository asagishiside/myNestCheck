import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeathersController } from './weathers/weathers.controller';
import { ConfigModule } from '@nestjs/config';
import configration from 'config/configration';
import { HttpModule } from '@nestjs/axios';
import { WeathersService } from './weathers/weathers.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configration],
      isGlobal: true,
    }),
    HttpModule,
  ],
  controllers: [AppController, WeathersController],
  providers: [AppService, WeathersService],
})
export class AppModule {}
