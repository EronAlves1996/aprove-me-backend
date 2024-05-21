import { Test, TestingModule } from '@nestjs/testing';
import { PayableController } from './payable.controller';
import { PayableService } from './payable.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { AssignorService } from 'src/assignor/assignor.service';
import { Response, response } from 'express';
import { AssignorModule } from 'src/assignor/assignor.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HttpStatus } from '@nestjs/common';

describe('PayableController', () => {
  let controller: PayableController;
  let prismaService: PrismaService;
  let assignorService: AssignorService;

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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new payable', async () => {
    const id = randomUUID();

    const creationSpy = jest
      .spyOn(prismaService.payable, 'create')
      .mockImplementation((_: any) => {
        return { id } as any;
      });

    const assignorExistsSpy = jest
      .spyOn(assignorService, 'exists')
      .mockImplementation((_) => Promise.resolve(true));

    const entity = {
      id: id,
      assignor: randomUUID(),
      emissionDate: new Date().toString(),
      value: 2.5,
    };

    const mockRes = {
      statusCode: 0,
      send: () => {},
      setHeader: () => {},
    };
    mockRes.send = jest.fn().mockReturnValue(mockRes);
    mockRes.setHeader = jest.fn().mockReturnValue(mockRes);

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
});
