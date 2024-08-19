import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Paper from "@mui/material/Paper";

import { getAllRecipes, getRecipeById } from "@/slices/recipes/recipes-thunk";
import { AppDispatch, RootState } from "@/store";
import { Recipe } from "@/slices/recipes/recipes-slice";
import RecipeCard from "@/components/RecipeCard";
import { useRouter } from "next/router";
import RecipesFilter from "@/components/RecipesFilter";
import { CircularProgress, Typography } from "@mui/material";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { recipes, recipesLoading } = useSelector<RootState>(
    ({ recipesReducer: { recipes, recipesLoading } }) => ({
      recipes,
      recipesLoading,
    })
  ) as { recipes: Array<Recipe>; recipesLoading: Boolean };

  useEffect(() => {
    dispatch(getAllRecipes({}));
  }, [dispatch]);

  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => router.push("/recipes/add")}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
        }}
      >
        <AddIcon />
      </Fab>
      <Container maxWidth="xl" sx={{ py: 4, minHeight: "calc(100vh - 64px)" }}>
        <Grid container spacing={2}>
          <Grid xs={3}>
            <RecipesFilter />
          </Grid>
          <Grid xs={9}>
            <Paper
              sx={{ p: 2, minHeight: "calc(100vh - 64px - 4rem)" }}
              elevation={3}
            >
              <Stack gap={2}>
                {recipesLoading ? (
                  <CircularProgress />
                ) : recipes.length ? (
                  recipes.map((recipe: Recipe) => (
                    <RecipeCard key={recipe.id} {...recipe} />
                  ))
                ) : (
                  <Typography variant="h6" textAlign="center">No records found</Typography>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
