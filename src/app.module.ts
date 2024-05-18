import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IntegrationsController } from './integrations/integrations.controller';

@Module({
  imports: [],
  controllers: [AppController, IntegrationsController],
  providers: [AppService],
})
export class AppModule {}
