import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import z from "zod";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  addNewRecipe,
  deleteRecipe,
  getAllRecipes,
  getRecipeById,
  starRecipe,
  updateRecipe,
} from "./recipes-thunk";

export interface Recipe {
  id?: string;
  name: string;
  email: string;
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  image: string;
  starred: boolean;
  createdAt?: number;
}

export const recipeSchema = z.object({
  id: z.number().nonnegative().optional(),
  name: z.string(),
  email: z.string().email(),
  title: z.string(),
  description: z.string(),
  ingredients: z.string(),
  instructions: z.string(),
  image: z.string().url(),
  starred: z.boolean(),
  createdAt: z.string().optional(),
});

export interface RecipesState {
  errors: Array<any>;
  recipes: Array<Recipe>;
  recipesLoading: boolean;
  selectedRecipe?: Recipe;
}

const initialState: RecipesState = {
  errors: [],
  recipes: [],
  recipesLoading: true,
  selectedRecipe: undefined,
};

export const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setSelectedRecipe: (state, action) => {
      state.selectedRecipe = action.payload;
    },
    addError: (state, action) => {
      state.errors.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(getAllRecipes.pending, (state, action) => {
    //   state.recipesLoading = true
    // })

    builder.addCase(getAllRecipes.fulfilled, (state, action) => {
      if (action.payload.error) {
        state.errors.push({
          t: new Date().valueOf(),
          ...action.payload,
        });

        return;
      }
      state.recipesLoading = false
      state.recipes = action.payload;
    });

    builder.addCase(getRecipeById.fulfilled, (state, action) => {
      if (action.payload.error) {
        state.errors.push({
          t: new Date().valueOf(),
          ...action.payload,
        });

        return;
      }
      state.selectedRecipe = action.payload;
    });

    builder.addCase(addNewRecipe.fulfilled, (state, action) => {
      if (action.payload.error) {
        state.errors.push({
          t: new Date().valueOf(),
          ...action.payload,
        });

        return;
      }
      state.recipes.push(action.payload);
    });

    builder.addCase(updateRecipe.fulfilled, (state, action) => {
      if (action.payload.error) {
        state.errors.push({
          t: new Date().valueOf(),
          ...action.payload,
        });

        return;
      }
      state.recipes.push(action.payload);
    });

    builder.addCase(deleteRecipe.fulfilled, (state, action) => {
      if (action.payload.error) {
        state.errors.push({
          t: new Date().valueOf(),
          ...action.payload,
        });

        return;
      }
      state.recipes = action.payload;
    });

    builder.addCase(starRecipe.fulfilled, (state, action) => {
      if (action.payload.error) {
        state.errors.push({
          t: new Date().valueOf(),
          ...action.payload,
        });

        return;
      }

      const recipeIndex = state.recipes.findIndex(
        (recipe: Recipe) => recipe.id === action.payload.id
      );
      state.recipes.splice(recipeIndex, 1, action.payload);
    });
  },
});

export const { setSelectedRecipe, addError } = recipesSlice.actions;
export default recipesSlice.reducer;
