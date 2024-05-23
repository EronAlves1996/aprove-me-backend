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
import { ENTITY_ID_NOT_EQUALS, NOT_FOUND } from 'src/messages';
import { AssignorService } from './assignor.service';
import { AssignorDTO } from './AssignorDTO';

@Controller('integrations/assignor')
export class AssignorController {
  constructor(private assignorService: AssignorService) {}

  @Get('/:id')
  async retrieve(@Param() { id }: { id: string }, @Res() response: Response) {
    const assignor = await this.assignorService.retrieve({ id });
    if (!assignor) {
      response.statusCode = HttpStatus.NOT_FOUND;
      response.json(NOT_FOUND);
      return;
    }
    return response.json(assignor);
  }

  @Post()
  async create(@Body() assignorDTO: AssignorDTO, @Res() response: Response) {
    const { id } = await this.assignorService.create(assignorDTO);
    response.setHeader('location', `/integrations/assignor/${id}`);
    response.statusCode = HttpStatus.CREATED;
    response.send();
  }

  @Put('/:id')
  async updateOrCreate(
    @Param() { id }: { id: string },
    @Body() assignorDTO: AssignorDTO,
    @Res() response: Response,
  ) {
    if (id !== assignorDTO.id) {
      response.statusCode = HttpStatus.BAD_REQUEST;
      response.json(ENTITY_ID_NOT_EQUALS);
      return;
    }

    if (!(await this.assignorService.exists({ id }))) {
      await this.create(assignorDTO, response);
      return;
    }

    await this.assignorService.update({ data: assignorDTO, where: { id } });
    response.send();
  }

  @Delete('/:id')
  async delete(@Param() { id }: { id: string }) {
    await this.assignorService.delete({ id });
  }
}
