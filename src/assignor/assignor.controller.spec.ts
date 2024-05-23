import { Test } from '@nestjs/testing';
import { AssignorController } from './assignor.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignorService } from './assignor.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { randomUUID } from 'crypto';
import { HttpStatus } from '@nestjs/common';
import { mockResponse } from 'src/mock-response';

describe('AssignorController', () => {
  let controller: AssignorController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AssignorController],
      providers: [AssignorService],
      imports: [PrismaModule],
    }).compile();

    controller = module.get<AssignorController>(AssignorController);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  const entity = {
    id: randomUUID(),
    document: '123.243.232-20',
    email: 'test@test.com',
    phone: '(33) 92243-2000',
    name: 'José Cuervo',
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new assignor', async () => {
    const createSpy = jest
      .spyOn(prismaService.assignor, 'create')
      .mockResolvedValue(entity);
    const res = mockResponse();
    await controller.create(entity, res as any);
    expect(res.setHeader).toHaveBeenCalledWith(
      'location',
      `/integrations/assignor/${entity.id}`,
    );
    expect(res.statusCode).toBe(HttpStatus.CREATED);
    expect(createSpy).toHaveBeenCalledWith({ data: entity });
  });
});
