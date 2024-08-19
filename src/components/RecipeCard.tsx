import styled from "@emotion/styled";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Star, StarOutline } from "@mui/icons-material";

import { Recipe } from "@/slices/recipes/recipes-slice";
import { Button, IconButton } from "@mui/material";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { starRecipe } from "@/slices/recipes/recipes-thunk";

const StyledCard = styled(Card)({
  display: "flex",
});

const StyledCardMedia = styled(CardMedia)({
  height: 150,
  width: 250,
});

const StyledCardContent = styled(CardContent)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
});

const StyledStack = styled(Stack)({
  marginTop: "auto",
});

export default function RecipeCard({
  id,
  title,
  name,
  description,
  image,
  starred,
  createdAt,
  ...rest
}: Recipe) {
  const dispatch = useDispatch<AppDispatch>();
  const Starred = starred ? Star : StarOutline;

  const handleStar = () => {
    dispatch(
      starRecipe({
        id,
        title,
        name,
        description,
        starred,
        createdAt,
        ...rest,
      } as Recipe)
    );
  };

  return (
    <StyledCard>
      <StyledCardMedia image={image} title={title}>
        <IconButton onClick={handleStar}>
          <Starred color="warning" />
        </IconButton>
      </StyledCardMedia>
      <StyledCardContent>
        <Typography
          gutterBottom
          variant="h5"
          component={Link}
          href={`/recipes/${id}/view`}
          fontWeight="bold"
          sx={{ textDecoration: 'none'}}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
          }}
        >
          {description}
        </Typography>
        <StyledStack direction="row" justifyContent="space-between">
          <Typography variant="subtitle2" component="div">
            Added by: {name}
          </Typography>
          {createdAt && (
            <Typography variant="subtitle2" component="div">
              Date: {new Date(createdAt).toDateString()}
            </Typography>
          )}
        </StyledStack>
      </StyledCardContent>
    </StyledCard>
  );
}
