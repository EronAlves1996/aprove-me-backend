import { Test } from '@nestjs/testing';
import { AssignorController } from './assignor.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignorService } from './assignor.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { randomUUID } from 'crypto';
import { HttpStatus } from '@nestjs/common';
import { mockResponse } from 'src/mock-response';
import { NOT_FOUND } from 'src/messages';

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

  afterEach(() => {
    jest.resetAllMocks();
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

  it('should retrieve an assignor', async () => {
    jest.spyOn(prismaService.assignor, 'findFirst').mockResolvedValue(entity);
    const response = mockResponse();
    await controller.retrieve({ id: entity.id }, response as any);
    expect(response.json).toHaveBeenCalledWith(entity);
  });

  it('should return 404 for assignor not found', async () => {
    jest.spyOn(prismaService.assignor, 'findFirst').mockResolvedValue(null);
    const response = mockResponse();
    await controller.retrieve({ id: entity.id }, response as any);
    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(response.json).toHaveBeenCalledWith(NOT_FOUND);
  });

  it('should update an existing assignor', async () => {
    jest.spyOn(prismaService.assignor, 'count').mockResolvedValue(1);
    const updateSpy = jest
      .spyOn(prismaService.assignor, 'update')
      .mockResolvedValue(null);
    const response = mockResponse();
    await controller.updateOrCreate({ id: entity.id }, entity, response as any);
    expect(updateSpy).toHaveBeenCalledWith({
      where: { id: entity.id },
      data: entity,
    });
  });

  it('should create a non-existing assignor when try to update', async () => {
    jest.spyOn(prismaService.assignor, 'count').mockResolvedValue(0);
    const createSpy = jest
      .spyOn(prismaService.assignor, 'create')
      .mockResolvedValue(entity);
    const response = mockResponse();
    await controller.updateOrCreate({ id: entity.id }, entity, response as any);
    expect(response.statusCode).toBe(HttpStatus.CREATED);
    expect(response.setHeader).toHaveBeenCalledWith(
      'location',
      `/integrations/assignor/${entity.id}`,
    );
    expect(createSpy).toHaveBeenCalledWith({ data: entity });
  });

  it('should delete an assignor', async () => {
    const deleteSpy = jest
      .spyOn(prismaService.assignor, 'delete')
      .mockResolvedValue(null);
    await controller.delete({ id: entity.id });
    expect(deleteSpy).toHaveBeenCalledWith({ where: { id: entity.id } });
  });
});
