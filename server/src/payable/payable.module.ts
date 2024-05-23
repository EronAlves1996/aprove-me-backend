import { Module } from '@nestjs/common';
import { AssignorModule } from 'src/assignor/assignor.module';
import { PayableController } from './payable.controller';
import { PayableService } from './payable.service';

@Module({
  controllers: [PayableController],
  imports: [AssignorModule],
  providers: [PayableService],
})
export class PayableModule {}
