import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}
  getHello(): string {
    return 'Hello World! 1';
  }
  async query(): Promise<string> {
    const l = await this.prismaService.user.findMany();
    console.log(l);
    return 'Hello World!';
  }
}
