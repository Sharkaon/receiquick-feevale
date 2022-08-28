import { z } from "zod";
import * as trpc from '@trpc/server';
import prisma from "../../prismaInstance";

const comments = trpc.router()
  .query('comment', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const comment = await prisma.comment.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          description: true,
          user: {
            select: {
              name: true,
            }
          },
        },
      });

      return comment;
    }
  })
  .query('comments', {
    input: z.object({
      recipeId: z.number(),
    }),
    async resolve({ input }) {
      const comments = await prisma.comment.findMany({
        where: {
          recipeId: input.recipeId,
        },
        select: {
          id: true,
          description: true,
          user: {
            select: {
              name: true,
            }
          },
        },
      });

      return comments;
    }
  })
  .mutation('createComment', {
    input: z.object({
      recipeId: z.number(),
      description: z.string(),
      userId: z.number(),
    }),
    async resolve({ input }) {
      const comment = await prisma.comment.create({
        data: {
          recipeId: input.recipeId,
          description: input.description,
          userId: input.userId,
        },
      });

      return comment;
    }
  });

export default comments;