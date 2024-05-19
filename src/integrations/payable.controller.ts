import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { PayableDTO } from '../dtos/PayableDTO';
import { PayableService } from 'src/services/payable.service';
import { Response } from 'express';

@Controller('integrations/payable')
export class PayableController {
  constructor(private payableService: PayableService) {}

  @Get('/:id')
  async retrieve(@Param() { id }: { id: string }, @Res() response: Response) {
    const payable = await this.payableService.retrieveById(id);
    if (!payable) {
      response.statusCode = 404;
      response.json({ message: 'Not Found' });
      return;
    }
    return response.json(payable);
  }

  @Post()
  async create(@Body() payableDTO: PayableDTO, @Res() response: Response) {
    const { assignor } = payableDTO;
    const { id } = await this.payableService.create({
      ...payableDTO,
      assignorData: {
        connect: {
          id: assignor,
        },
      },
    });
    response.setHeader('location', `/integrations/payable/${id}`);
    response.statusCode = 201;
    response.send();
  }
}
