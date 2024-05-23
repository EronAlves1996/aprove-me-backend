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
import { Response } from 'express';
import { AssignorService } from 'src/assignor/assignor.service';
import { ENTITY_ID_NOT_EQUALS, NOT_FOUND } from 'src/messages';
import { PayableService } from './payable.service';
import { PayableDTO } from './PayableDTO';

@Controller('integrations/payable')
export class PayableController {
  constructor(
    private payableService: PayableService,
    private assignorService: AssignorService,
  ) {}

  @Get('/:id')
  async retrieve(@Param() { id }: { id: string }, @Res() response: Response) {
    const payable = await this.payableService.retrieve({ id });
    if (!payable) {
      response.statusCode = HttpStatus.NOT_FOUND;
      response.json(NOT_FOUND);
      return;
    }
    return response.json(payable);
  }

  @Post()
  async create(@Body() payableDTO: PayableDTO, @Res() response: Response) {
    const { assignor, emissionDate, id, value } = payableDTO;

    if (!(await this.assignorExists(assignor, response))) return;

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
    response.statusCode = HttpStatus.CREATED;
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
    if (!(await this.payableService.exists({ id }))) {
      await this.create(data, response);
      return;
    }

    const { assignor, emissionDate, value } = data;

    if (!(await this.assignorExists(assignor, response))) return;

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
  }

  @Delete('/:id')
  async delete(@Param() { id }: { id: string }) {
    await this.payableService.delete({ id });
  }

  private async assignorExists(
    id: string,
    response: Response,
  ): Promise<boolean> {
    const exists = await this.assignorService.exists({ id });
    if (!exists) {
      response.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      response.json({ message: "The specified assignor doesn't exists" });
    }
    return exists;
  }
}
