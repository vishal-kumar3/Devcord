import { Prisma } from "@prisma/client";

export const User = Prisma.validator<Prisma.UserDefaultArgs>()({});
