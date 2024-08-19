import { NextApiRequest, NextApiResponse } from "next";

import { recipeSchema } from "@/slices/recipes/recipes-slice";
import { nanoid } from "@/utils/id";
import { readRecipesFromFile, writeRecipesToFile } from "@/utils/recipes-utils";

import type { Recipe } from "@/slices/recipes/recipes-slice";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let recipes: Recipe[] = await readRecipesFromFile();

  if (req.method === "GET") {
    if (req.query.id?.length) {
      if (req.query.id?.length > 1)
        return res.status(404).json({ error: "Recipe not found" });

      const id = Number(req.query.id?.[0]);

      const recipe: Recipe | undefined = recipes.find(
        (recipe: Recipe) => String(recipe.id) === String(id)
      );

      if (typeof recipe === "undefined") {
        return res.status(404).json({ error: "Recipe not found" });
      }

      return res.status(200).json(recipe);
    }

    let allRecipes: Array<Recipe> = recipes;

    if (req.query.sortBy) {
      const sortBy = req.query.sortBy;
      allRecipes = allRecipes.sort((a: Recipe, b: Recipe) => {
        switch (sortBy) {
          case "ASC":
            return a.title.localeCompare(b.title);
          case "DESC":
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
    }

    if (req.query.q) {
      const query = req.query.q as string;
      allRecipes = allRecipes.filter((recipe: Recipe) => {
        return recipe.title
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase());
      });
    }

    if (req.query.starred) {
      const starred = req.query.starred === "true";

      allRecipes = allRecipes.filter((recipe: Recipe) => {
        return recipe.starred === starred;
      });
    }

    return res.status(200).json(allRecipes);
  }

  if (req.method === "POST") {
    const body = JSON.parse(req.body);

    const existingTitles: string[] = recipes.map(
      (recipe: Recipe) => recipe.title
    );

    if (existingTitles.includes(body.title)) {
      return res.status(400).json({
        error: "Recipe with the same title already exists",
      });
    }

    const validate = recipeSchema.safeParse(body);
    if (!validate.success) {
      return res
        .status(400)
        .json({ error: "Invalid recipe data", issues: validate.error.issues });
    }

    const newId = nanoid(8);

    recipes.push({
      id: newId,
      createdAt: new Date().valueOf(),
      ...body,
    });
    await writeRecipesToFile(recipes);
    return res.status(200).json(recipes.at(-1));
  }

  if (req.method === "PATCH") {
    const body = JSON.parse(req.body);

    const recipesCopy = [...recipes];
    const updateIndex = recipes.findIndex((recipe: Recipe) => {
      return recipe.id === body.id;
    });

    if (updateIndex === -1) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    recipesCopy.splice(updateIndex, 1, body);
    await writeRecipesToFile(recipesCopy);
    return res.status(200).json(recipesCopy.at(updateIndex));
  }

  if (req.method === "DELETE") {
    const body = JSON.parse(req.body);

    const recipesCopy = [...recipes];
    const deleteIndex = recipes.findIndex(
      (recipe: Recipe) => String(recipe.id) === String(body.id)
    );

    if (deleteIndex === -1) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    recipesCopy.splice(deleteIndex, 1);
    await writeRecipesToFile(recipesCopy);
    return res.status(200).json(recipesCopy);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
