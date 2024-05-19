import { Injectable } from '@nestjs/common';
import { Assignor, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AssignorService {
  constructor(private prismaService: PrismaService) {}

  retrieveById(id: string): Promise<Assignor> {
    return this.prismaService.assignor.findFirst({
      select: {
        document: true,
        id: true,
        email: true,
        name: true,
        phone: true,
      },
      where: { id },
    });
  }

  create(data: Prisma.AssignorCreateWithoutPayableInput): Promise<Assignor> {
    return this.prismaService.assignor.create({ data });
  }
}
