import * as trpc from '@trpc/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const recipes = trpc.router()
  .query('recipe', {
    input: z.object({
      id: z.number(),
    }),
    async resolve( { input } ) {
      const recipes = await prisma.recipe.findUnique({
        where: {
          id: input.id
        },
        select: {
          id: true,
          name: true,
          ingredients: {
            select: {
              ingredient: {
                select: {
                  id: true,
                  name: true,
                }
              },
              amount: true
            }
          }
        }
      });

      return recipes;
    }
  })
  .query('recipes', {
    async resolve( _req ) {
      const recipes = await prisma.recipe.findMany({
        select: {
          id: true,
          name: true,
          ingredients: {
            select: {
              ingredient: {
                select: {
                  id: true,
                  name: true,
                }
              },
              amount: true
            }
          }
        }
      });

      return recipes;
    }
  })
  .mutation('createRecipe', {
    input: z.object({
      name: z.string(),
      ingredients: z.array(z.object({
        id: z.number(),
        amount: z.number()
      })),
    }),
    async resolve({ input }) {
      debugger;
      const recipe = await prisma.recipe.create({
        data: {
          name: input.name,
          ingredients: {
            create: input.ingredients.map(ingredient => ({
              amount: ingredient.amount,
              ingredient: {
                connect: {
                  id: ingredient.id,
                }
              }
            }))
          }
        }
      });

      return recipe;
    }
  })
  .mutation('updateRecipe', {
    input: z.object({
      id: z.number(),
      data: z.object({
        name: z.string(),
        ingredients: z.array(z.number()),
      }),
    }),
    async resolve({ input }) {
      const recipe = await prisma.recipe.update({
        where: {
          id: input.id
        },
        data: {
          ...input.data,
        }
      });

      return recipe;
    }
  })
  .mutation('deleteRecipe', {
    input: z.number(),
    async resolve({ input }) {
      const recipe = await prisma.recipe.delete({
        where: {
          id: input
        }
      });

      return recipe;
    }
  });

export default recipes;