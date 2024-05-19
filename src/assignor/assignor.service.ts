import { Injectable } from '@nestjs/common';
import { Assignor, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AssignorService {
  constructor(private prismaService: PrismaService) {}

  async exists(where: Prisma.AssignorWhereUniqueInput): Promise<boolean> {
    return (await this.prismaService.assignor.count({ where })) > 0;
  }

  retrieve(where: Prisma.AssignorWhereUniqueInput): Promise<Assignor> {
    return this.prismaService.assignor.findFirst({
      select: {
        document: true,
        id: true,
        email: true,
        name: true,
        phone: true,
      },
      where,
    });
  }

  create(data: Prisma.AssignorCreateWithoutPayableInput): Promise<Assignor> {
    return this.prismaService.assignor.create({ data });
  }

  async update({
    data,
    where,
  }: {
    data: Prisma.AssignorCreateWithoutPayableInput;
    where: Prisma.AssignorWhereUniqueInput;
  }): Promise<void> {
    this.prismaService.assignor.update({ data, where });
  }

  async delete(where: Prisma.AssignorWhereUniqueInput): Promise<void> {
    this.prismaService.assignor.delete({ where });
  }
}
