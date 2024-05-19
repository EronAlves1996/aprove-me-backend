import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { PayableDTO } from '../dtos/PayableDTO';
import { PayableService } from 'src/services/payable.service';
import { Response } from 'express';

@Controller('integrations/payable')
export class IntegrationsController {
  constructor(private payableService: PayableService) {}

  @Post()
  async create(@Body() payableDTO: PayableDTO, @Res() response: Response) {
    const { assignor } = payableDTO;
    const created = await this.payableService.create({
      ...payableDTO,
      assignorData: {
        connect: {
          id: assignor,
        },
      },
    });
    response.setHeader('location', `/integrations/payable/${created.id}`);
    response.statusCode = 201;
  }
}
