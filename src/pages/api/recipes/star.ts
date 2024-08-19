import { readRecipesFromFile, writeRecipesToFile } from "@/utils/recipes-utils";

import type { Recipe } from "@/slices/recipes/recipes-slice";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const recipes: Recipe[] = await readRecipesFromFile();
  const body = JSON.parse(req.body)

  const recipe: Recipe | undefined = recipes.find(
    (recipe: Recipe) => recipe.id === body.id
  );

  const newRecipe = {
    ...recipe,
    starred: !body?.starred
  } as Recipe

  const recipesCopy = [...recipes]
  const recipeIndex = recipes.findIndex((recipe: Recipe) => recipe.id === body.id)

  recipesCopy.splice(recipeIndex, 1, newRecipe)
  writeRecipesToFile(recipesCopy)
  return res.status(200).json(newRecipe)
}
