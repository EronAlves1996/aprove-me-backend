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

const mockResponse = () => {
  const mockRes = {
    statusCode: 0,
    send: () => {},
    setHeader: () => {},
    json: () => {},
  };
  mockRes.send = jest.fn().mockReturnValue(mockRes);
  mockRes.setHeader = jest.fn().mockReturnValue(mockRes);
  mockRes.json = jest.fn().mockReturnValue(mockRes);
  return mockRes;
};

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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new payable', async () => {
    const { id } = entity;

    const creationSpy = jest
      .spyOn(prismaService.payable, 'create')
      .mockReturnValue({ id } as any);

    const assignorExistsSpy = jest
      .spyOn(assignorService, 'exists')
      .mockResolvedValue(true);

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
    expect(assignorExistsSpy).toHaveBeenCalledWith({ id: entity.assignor });
  });

  it('should return 422 for non existent assignor', async () => {
    jest.spyOn(assignorService, 'exists').mockResolvedValue(false);
    const mockRes = mockResponse();
    await controller.create(entity, mockRes as any);
    expect(mockRes.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "The specified assignor doesn't exists",
    });
  });

  it('should consult a payable by id', async () => {
    const { id } = entity;
    jest
      .spyOn(prismaService.payable, 'findFirst')
      .mockResolvedValue(entity as any);
    const mockRes = mockResponse();
    await controller.retrieve({ id }, mockRes as any);
    expect(mockRes.json).toHaveBeenCalledWith(entity);
  });

  it('should return 404 for non existent payable', async () => {
    const { id } = entity;
    jest
      .spyOn(prismaService.payable, 'findFirst')
      .mockResolvedValue(null as any);

    const mockRes = mockResponse();
    await controller.retrieve({ id }, mockRes as any);
    expect(mockRes.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(mockRes.json).toHaveBeenCalledWith(NOT_FOUND);
  });

  it('should update a record that already exists', async () => {
    const existsSpy = jest
      .spyOn(prismaService.payable, 'count')
      .mockResolvedValue(1 as any);
    const assignorExistsSpy = jest
      .spyOn(assignorService, 'exists')
      .mockResolvedValue(true);
    const updateSpy = jest
      .spyOn(prismaService.payable, 'update')
      .mockResolvedValue(entity as any);

    const res = mockResponse();
    await controller.createOrUpdate({ id: entity.id }, entity, res as any);

    expect(existsSpy).toHaveBeenCalledWith({ where: { id: entity.id } });
    expect(assignorExistsSpy).toHaveBeenCalledWith({ id: entity.assignor });
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
});
