import { Body, Controller, Post } from '@nestjs/common';
import { PayableDTO } from '../dtos/PayableDTO';

@Controller('integrations/payable')
export class IntegrationsController {
  @Post()
  createPayable(@Body() payableDTO: PayableDTO) {
    return payableDTO;
  }
}
