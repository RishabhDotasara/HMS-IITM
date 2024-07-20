// global.d.ts

import { PrismaClient } from "@prisma/client";

declare namespace NodeJS {
    interface Global {
      prisma: PrismaClient | undefined; // Define the type for your custom property
    }
  }
  