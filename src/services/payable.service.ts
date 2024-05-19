import { Injectable } from '@nestjs/common';
import { Payable, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PayableService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PayableCreateInput): Promise<Payable> {
    return this.prisma.payable.create({
      data,
    });
  }

  async retrieveById(id: string): Promise<Payable> {
    return this.prisma.payable.findFirst({ where: { id } });
  }
}
