import path from "path";
import fs from "fs/promises";
import type { Recipe } from "@/slices/recipes/recipes-slice";

const recipesFilePath = path.resolve("./recipes.json");

export const writeRecipesToFile = async (recipes: Recipe[]) => {
  await fs.writeFile(recipesFilePath, JSON.stringify(recipes, null, 2));
};

export const readRecipesFromFile = async (): Promise<Recipe[]> => {
  try {
    const recipesData = await fs.readFile(recipesFilePath, "utf-8");
    return JSON.parse(recipesData);
  } catch (error) {
    console.error("Error reading recipes file:", error);
    return [];
  }
};
