import { Test, TestingModule } from '@nestjs/testing';
import { PayableController } from './payable.controller';
import { PayableService } from './payable.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { AssignorService } from 'src/assignor/assignor.service';
import { AssignorModule } from 'src/assignor/assignor.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HttpStatus } from '@nestjs/common';
import { NOT_FOUND } from 'src/messages';
import { mockResponse } from 'src/mock-response';

describe('PayableController', () => {
  let controller: PayableController;
  let prismaService: PrismaService;
  let assignorService: AssignorService;

  const entity = {
    id: randomUUID(),
    assignor: randomUUID(),
    emissionDate: new Date().toISOString(),
    value: 2.5,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayableController],
      providers: [PayableService],
      imports: [AssignorModule, PrismaModule],
    }).compile();

    controller = module.get<PayableController>(PayableController);
    prismaService = module.get<PrismaService>(PrismaService);
    assignorService = module.get<AssignorService>(AssignorService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const payableExistsSpy = () => jest.spyOn(prismaService.payable, 'count');
  const assignorExistsSpy = () => jest.spyOn(assignorService, 'exists');

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new payable', async () => {
    const { id } = entity;

    const creationSpy = jest
      .spyOn(prismaService.payable, 'create')
      .mockReturnValue({ id } as any);

    const assignorSpy = assignorExistsSpy().mockResolvedValue(true as any);

    const mockRes = mockResponse();
    await controller.create(entity, mockRes as any);
    expect(mockRes.statusCode).toBe(HttpStatus.CREATED);
    expect(mockRes.setHeader).toHaveBeenCalledWith(
      'location',
      `/integrations/payable/${id}`,
    );
    expect(mockRes.send).toHaveBeenCalled();
    expect(creationSpy).toHaveBeenCalledWith({
      data: {
        id,
        emissionDate: entity.emissionDate,
        value: entity.value,
        assignorData: { connect: { id: entity.assignor } },
      },
    });
    expect(assignorSpy).toHaveBeenCalledWith({ id: entity.assignor });
  });

  it('should return 422 for non existent assignor', async () => {
    assignorExistsSpy().mockResolvedValue(false);
    const mockRes = mockResponse();
    await controller.create(entity, mockRes as any);
    expect(mockRes.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "The specified assignor doesn't exists",
    });
  });

  const getEntitySpy = () => jest.spyOn(prismaService.payable, 'findFirst');

  it('should consult a payable by id', async () => {
    const { id } = entity;
    getEntitySpy().mockResolvedValue(entity as any);
    const mockRes = mockResponse();
    await controller.retrieve({ id }, mockRes as any);
    expect(mockRes.json).toHaveBeenCalledWith(entity);
  });

  it('should return 404 for non existent payable', async () => {
    const { id } = entity;
    getEntitySpy().mockResolvedValue(null as any);
    const mockRes = mockResponse();
    await controller.retrieve({ id }, mockRes as any);
    expect(mockRes.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(mockRes.json).toHaveBeenCalledWith(NOT_FOUND);
  });

  it('should update a record that already exists', async () => {
    const existsSpy = payableExistsSpy().mockResolvedValue(1 as any);
    const assignorSpy = assignorExistsSpy().mockResolvedValue(true);
    const updateSpy = jest
      .spyOn(prismaService.payable, 'update')
      .mockResolvedValue(entity as any);

    const res = mockResponse();
    await controller.createOrUpdate({ id: entity.id }, entity, res as any);

    expect(existsSpy).toHaveBeenCalledWith({ where: { id: entity.id } });
    expect(assignorSpy).toHaveBeenCalledWith({ id: entity.assignor });
    expect(updateSpy).toHaveBeenCalledWith({
      where: { id: entity.id },
      data: {
        id: entity.id,
        emissionDate: entity.emissionDate,
        value: entity.value,
        assignorData: {
          connect: {
            id: entity.assignor,
          },
        },
      },
    });
    expect(res.send).toHaveBeenCalled();
  });

  it("should create a record when try to update and don't exists", async () => {
    payableExistsSpy().mockResolvedValue(0);
    assignorExistsSpy().mockResolvedValue(true);
    const createSpy = jest
      .spyOn(prismaService.payable, 'create')
      .mockResolvedValue(entity as any);
    const updateSpy = jest
      .spyOn(prismaService.payable, 'update')
      .mockResolvedValue(entity as any);

    const res = mockResponse();
    await controller.createOrUpdate({ id: entity.id }, entity, res as any);
    expect(res.statusCode).toBe(HttpStatus.CREATED);
    expect(res.setHeader).toHaveBeenCalledWith(
      'location',
      `/integrations/payable/${entity.id}`,
    );
    expect(updateSpy).toHaveBeenCalledTimes(0);
    expect(createSpy).toHaveBeenCalledWith({
      data: {
        id: entity.id,
        emissionDate: entity.emissionDate,
        value: entity.value,
        assignorData: {
          connect: {
            id: entity.assignor,
          },
        },
      },
    });
  });

  it('should delete a payable', async () => {
    const deleteSpy = jest
      .spyOn(prismaService.payable, 'delete')
      .mockResolvedValue(null);
    await controller.delete({ id: entity.id });
    expect(deleteSpy).toHaveBeenCalledWith({ where: { id: entity.id } });
  });
});
