import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  IconButton,
  Stack,
  styled,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { ArrowBack, CloudUpload } from "@mui/icons-material";
import { useRouter } from "next/router";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  addNewRecipe,
  deleteRecipe,
  updateRecipe,
} from "@/slices/recipes/recipes-thunk";
import {
  Recipe,
  addError,
  setSelectedRecipe,
} from "@/slices/recipes/recipes-slice";
import CallableConfirm from "./Dialog";

const StyledImage = styled(Image)({
  width: "100%",
  borderRadius: "0.5rem",
  marginBottom: "1rem",
  objectFit: "cover",
});

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  title: z.string().min(1, "Title is required"),
  image: z.string().min(1, "Image is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  ingredients: z.string().min(1, "Ingredients are required"),
  instructions: z.string().min(1, "Instructions are required"),
  starred: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function RecipeForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const selectedRecipe = useSelector<RootState>(
    ({ recipesReducer: { selectedRecipe } }) => selectedRecipe
  ) as Recipe;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      title: "",
      image: "",
      description: "",
      ingredients: "",
      instructions: "",
      starred: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    let result;
    if (router.query.action === "view") {
      result = await dispatch(
        updateRecipe({
          id: router.query.id as string,
          createdAt: new Date().valueOf(),
          ...data,
        } as Recipe)
      ).unwrap();
    } else {
      result = await dispatch(addNewRecipe(data as Recipe)).unwrap();
    }
    if (result.error) return;

    router.push(`/recipes/${result.id}/view`);
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = new FormData();

      file.append("file", event.target.files[0]);

      const res = await fetch("/api/recipes/upload_image", {
        method: "POST",
        body: file,
      });

      const resp = await res.json();

      setValue("image", resp.fileUrl);
    }
  };

  const handleDeleteRecipe = async () => {
    const res = await dispatch(deleteRecipe(selectedRecipe)).unwrap();
    if (res.error) return;
    router.push("/");
  };

  useEffect(() => {
    const handleRouteChange = () => {
      dispatch(setSelectedRecipe({}));
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router, dispatch]);

  useEffect(() => {
    if (selectedRecipe) {
      reset(selectedRecipe);
    }
  }, [selectedRecipe, reset]);

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: "calc(100vh - 64px)" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid xs={3}>
            <Stack alignItems="start">
              <Button sx={{ mb: 2 }} onClick={router.back}>
                <ArrowBack /> Back
              </Button>
              <StyledImage
                src={
                  watch("image") ||
                  "https://placehold.co/600x500?text=Upload+Image"
                }
                alt="recipe-image"
                width={300}
                height={300}
              />

              <Box sx={{ mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                {router.query.action !== "view" && (
                  <>
                    <label htmlFor="image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUpload />}
                      >
                        Upload Image
                      </Button>
                    </label>
                    {errors.image && (
                      <Typography
                        color="error"
                        variant="caption"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        {errors.image.message}
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            </Stack>
          </Grid>
          <Grid xs={9}>
            <Paper sx={{ p: 2 }} elevation={3}>
              <Typography variant="h5" gutterBottom>
                {router.query.action === "view"
                  ? selectedRecipe?.title
                  : "New Recipe"}
              </Typography>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputProps={{
                      readOnly: router.query.action === "view",
                    }}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email Address"
                    fullWidth
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      readOnly: router.query.action === "view",
                    }}
                  />
                )}
              />
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Title"
                    fullWidth
                    margin="normal"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    InputProps={{
                      readOnly: router.query.action === "view",
                    }}
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
              <Controller
                name="ingredients"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ingredients"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    error={!!errors.ingredients}
                    helperText={errors.ingredients?.message}
                  />
                )}
              />
              <Controller
                name="instructions"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Instructions"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    error={!!errors.instructions}
                    helperText={errors.instructions?.message}
                  />
                )}
              />
              <Stack direction="row-reverse" gap={2}>
                <Button
                  onClick={() => {
                    if (router.query.action !== "view") return
                    CallableConfirm.call({
                      message: "Are you sure you want to update this recipe?",
                      title: "Confirm Update",
                      onConfirm: handleSubmit(onSubmit),
                    });
                  }}
                  type={router.query.action === "view" ? "button" : "submit"}
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Save
                </Button>
                {router.query.action === "view" && (
                  <Button
                    onClick={() => {
                      CallableConfirm.call({
                        message: "Are you sure you want to delete this item?",
                        title: "Confirm Deletion",
                        onConfirm: handleDeleteRecipe,
                      });
                    }}
                    type="button"
                    variant="contained"
                    color="error"
                    sx={{ mt: 2 }}
                  >
                    Delete
                  </Button>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
