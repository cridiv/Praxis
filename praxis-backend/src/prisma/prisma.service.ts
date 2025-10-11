import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }
  async onModuleInit() {
    await (this as typeof PrismaClient.prototype).$connect();
  }

  async onModuleDestroy() {
    await (this as typeof PrismaClient.prototype).$disconnect();
  }
  }

