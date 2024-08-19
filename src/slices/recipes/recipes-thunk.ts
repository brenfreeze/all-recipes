import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Recipe } from "./recipes-slice";
import transformFilterToQueryString from "@/utils/transform-qs";

export interface RecipesFilter {
  q?: String;
  starred?: boolean;
  sortBy?: "ASC" | "DESC";
}

export const getAllRecipes = createAsyncThunk(
  "recipes/all",
  async (filter: RecipesFilter, { rejectWithValue }) => {
    try {
      const qs = transformFilterToQueryString(filter);
      const res = await fetch(`/api/recipes${qs && `?${qs}`}`);

      return res.json();
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getRecipeById = createAsyncThunk(
  "recipes/id",
  async (recipeId: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/recipes/${recipeId}`);

      return res.json();
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addNewRecipe = createAsyncThunk(
  "recipes/add",
  async (recipe: Recipe, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        body: JSON.stringify(recipe),
      });

      return res.json();
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateRecipe = createAsyncThunk(
  "recipes/update",
  async (recipe: Recipe, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/recipes", {
        method: "PATCH",
        body: JSON.stringify(recipe),
      });

      return res.json();
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteRecipe = createAsyncThunk(
  "recipes/delete",
  async (recipe: Recipe, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/recipes", {
        method: "DELETE",
        body: JSON.stringify(recipe),
      });

      return res.json();
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const starRecipe = createAsyncThunk(
  "recipes/star",
  async (recipe: Recipe, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/recipes/star", {
        method: "POST",
        body: JSON.stringify(recipe),
      });

      return res.json();
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

