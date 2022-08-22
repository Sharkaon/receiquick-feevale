-- DropForeignKey
ALTER TABLE "IngredientsOnRecipes" DROP CONSTRAINT "IngredientsOnRecipes_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "IngredientsOnRecipes" DROP CONSTRAINT "IngredientsOnRecipes_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "Steps" DROP CONSTRAINT "Steps_recipeId_fkey";

-- AddForeignKey
ALTER TABLE "IngredientsOnRecipes" ADD CONSTRAINT "IngredientsOnRecipes_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientsOnRecipes" ADD CONSTRAINT "IngredientsOnRecipes_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Steps" ADD CONSTRAINT "Steps_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
