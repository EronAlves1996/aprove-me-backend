import { Injectable } from '@nestjs/common';
import { Payable, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PayableService {
  constructor(private prisma: PrismaService) {}

  async exists(where: Prisma.PayableWhereUniqueInput): Promise<boolean> {
    return (await this.prisma.payable.count({ where })) > 0;
  }

  retrieve(where: Prisma.PayableWhereUniqueInput): Promise<Payable> {
    return this.prisma.payable.findFirst({ where });
  }

  create(data: Prisma.PayableCreateInput): Promise<Payable> {
    return this.prisma.payable.create({
      data,
    });
  }

  async update({
    data,
    where,
  }: {
    data: Prisma.PayableCreateInput;
    where: Prisma.PayableWhereUniqueInput;
  }): Promise<void> {
    this.prisma.payable.update({ data, where });
  }

  async delete(where: Prisma.PayableWhereUniqueInput) {
    this.prisma.payable.delete({ where });
  }
}
