import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AssignorDTO } from 'src/dtos/AssignorDTO';
import { AssignorService } from 'src/services/assignor.service';

@Controller('integrations/assignor')
export class AssignorController {
  constructor(private assignorService: AssignorService) {}

  @Get('/:id')
  async retrieve(@Param() { id }: { id: string }, @Res() response: Response) {
    const assignor = await this.assignorService.retrieveById(id);
    if (!assignor) {
      response.statusCode = 404;
      return { message: 'Not Found' };
    }
    return assignor;
  }

  @Post()
  async create(@Body() assignorDTO: AssignorDTO, @Res() response: Response) {
    const { id } = await this.assignorService.create(assignorDTO);
    response.setHeader('location', `/integrations/payable/${id}`);
    response.statusCode = 201;
  }
}
