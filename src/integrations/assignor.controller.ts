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
import { AssignorDTO } from 'src/dtos/AssignorDTO';
import { AssignorService } from 'src/services/assignor.service';

@Controller('integrations/assignor')
export class AssignorController {
  constructor(private assignorService: AssignorService) {}

  @Get('/:id')
  async retrieve(@Param() { id }: { id: string }, @Res() response: Response) {
    const assignor = await this.assignorService.retrieve({ id });
    if (!assignor) {
      response.statusCode = 404;
      response.json({ message: 'Not Found' });
      return;
    }
    return response.json(assignor);
  }

  @Post()
  async create(@Body() assignorDTO: AssignorDTO, @Res() response: Response) {
    const { id } = await this.assignorService.create(assignorDTO);
    response.setHeader('location', `/integrations/payable/${id}`);
    response.statusCode = 201;
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
      response.json({
        message:
          'Operation permitted only on entity specified in path param. Verify your input and try again',
      });
      return;
    }

    if (await this.assignorService.exists({ id })) {
      await this.assignorService.update({ data: assignorDTO, where: { id } });
      response.send();
      return;
    }

    await this.create(assignorDTO, response);
  }

  @Delete('/:id')
  async delete(@Param() { id }: { id: string }) {
    await this.assignorService.delete({ id });
  }
}
