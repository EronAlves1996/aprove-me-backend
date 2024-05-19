import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { IntegrationsController } from './integrations/payable.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, IntegrationsController],
  providers: [AppService],
})
export class AppModule {}
