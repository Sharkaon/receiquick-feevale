import * as trpc from '@trpc/server';
import { z } from 'zod';

import prisma from '../../prismaInstance';

const users = trpc.router()
  // gets one user by its email
  .query('user', {
    input: z.object({
      email: z.string(),
    }),
    async resolve( { input } ) {
      const user = await prisma.user.findUnique({
        where: {
          email: input.email
        },
        select: {
          id: true,
          email: true,
          name: true,
        }
      });

      return user;
    }
  })
  .query('users', {
    async resolve( _req ) {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
        }
      });

      return users;
    }
  })
  .mutation('createUser', {
    input: z.object({
      email: z.string(),
      name: z.string(),
    }),
    async resolve({ input }) {
      const user = await prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
        }
      });

      return user;
    }
  });


export default users;