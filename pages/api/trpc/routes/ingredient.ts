import * as trpc from '@trpc/server';
import { z } from 'zod';

import prisma from '../../prismaInstance';

const ingredients = trpc.router()
  .query('ingredient', {
    input: z.object({
      id: z.number(),
    }),
    async resolve( { input } ) {
      const ingredients = await prisma.ingredient.findUnique({
        where: {
          id: input.id
        },
        select: {
          id: true,
          name: true,
          recipes: true
        }
      });

      return ingredients;
    }
  })
  .query('ingredients', {
    async resolve( _req ) {
      const ingredients = await prisma.ingredient.findMany({
        select: {
          id: true,
          name: true,
        }
      });

      return ingredients;
    }
  })
  .mutation('createIngredient', {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ input }) {
      const ingredient = await prisma.ingredient.create({
        data: {
          name: input.name,
        }
      });

      return ingredient;
    }
  })
  .mutation('updateIngredient', {
    input: z.object({
      id: z.number(),
      data: z.object({
        name: z.string(),
      }),
    }),
    async resolve({ input }) {
      const ingredient = await prisma.ingredient.update({
        where: {
          id: input.id
        },
        data: {
          ...input.data,
        }
      });

      return ingredient;
    }
  })
  .mutation('deleteIngredient', {
    input: z.number(),
    async resolve({ input }) {
      const ingredient = await prisma.ingredient.delete({
        where: {
          id: input
        }
      });

      return ingredient;
    }
  });

export default ingredients;