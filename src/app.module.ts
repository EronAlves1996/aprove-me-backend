import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AssignorController } from './integrations/assignor.controller';
import { PayableController } from './integrations/payable.controller';
import { PayableService } from './services/payable.service';
import { AssignorService } from './services/assignor.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, PayableController, AssignorController],
  providers: [AppService, PayableService, AssignorService, PrismaService],
})
export class AppModule {}
