import * as trpc from '@trpc/server';
import { z } from 'zod';

import prisma from '../../prismaInstance';

const steps = trpc.router()
  .query('steps', {
    input: z.object({
      recipeId: z.number(),
    }),
    async resolve( { input } ) {
      const steps = await prisma.steps.findMany({
        where: {
          recipeId: input.recipeId
        },
        select: {
          id: true,
          recipeId: true,
          description: true,
        }
      });

      return steps;
    }
  });
  
export default steps;