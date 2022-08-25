import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import ingredients from './routes/ingredient';
import recipes from './routes/recipe';
import steps from './routes/step';
import users from './routes/user';

const appRouter = trpc.router()
  .merge('ingredient.', ingredients)
  .merge('recipe.', recipes)
  .merge('steps.', steps)
  .merge('user.', users);

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});