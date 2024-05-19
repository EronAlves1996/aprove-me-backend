import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { PayableDTO } from '../dtos/PayableDTO';
import { PayableService } from 'src/services/payable.service';
import { Response } from 'express';
import { ENTITY_ID_NOT_EQUALS } from 'src/messages';

@Controller('integrations/payable')
export class PayableController {
  constructor(private payableService: PayableService) {}

  @Get('/:id')
  async retrieve(@Param() { id }: { id: string }, @Res() response: Response) {
    const payable = await this.payableService.retrieve({ id });
    if (!payable) {
      response.statusCode = 404;
      response.json({ message: 'Not Found' });
      return;
    }
    return response.json(payable);
  }

  @Post()
  async create(@Body() payableDTO: PayableDTO, @Res() response: Response) {
    const { assignor, emissionDate, id, value } = payableDTO;
    const { id: createdId } = await this.payableService.create({
      id,
      emissionDate,
      value,
      assignorData: {
        connect: {
          id: assignor,
        },
      },
    });
    response.setHeader('location', `/integrations/payable/${createdId}`);
    response.statusCode = 201;
    response.send();
  }

  @Put('/:id')
  async createOrUpdate(
    @Param() { id }: { id: string },
    @Body() data: PayableDTO,
    @Res() response: Response,
  ) {
    if (id !== data.id) {
      response.statusCode = HttpStatus.BAD_REQUEST;
      response.json(ENTITY_ID_NOT_EQUALS);
      return;
    }
    if (await this.payableService.exists({ id })) {
      const { assignor, emissionDate, value } = data;
      await this.payableService.update({
        where: { id },
        data: {
          id,
          emissionDate,
          value,
          assignorData: {
            connect: {
              id: assignor,
            },
          },
        },
      });
      response.send();
      return;
    }
    await this.create(data, response);
  }

  @Delete('/:id')
  async delete(@Param() { id }: { id: string }) {
    await this.payableService.delete({ id });
  }
}
