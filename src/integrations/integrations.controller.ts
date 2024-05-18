import { Body, Controller, Post } from '@nestjs/common';
import { PayableDTO } from '../dtos/PayableDTO';

@Controller('integrations')
export class IntegrationsController {
  @Post('payable')
  createPayable(@Body() payableDTO: PayableDTO) {
    return payableDTO;
  }
}
