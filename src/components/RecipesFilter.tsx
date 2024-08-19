import { ChangeEvent, useEffect, useState } from "react";
import { Button, Stack } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Paper from "@mui/material/Paper";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { getAllRecipes } from "@/slices/recipes/recipes-thunk";
import type { RecipesFilter } from "@/slices/recipes/recipes-thunk";

export default function RecipesFilter() {
  const dispatch = useDispatch<AppDispatch>();
  const [sort, setSort] = useState("");
  const [filters, setFilters] = useState<{ starred?: boolean; sortBy?: string }>({
    starred: undefined,
    sortBy: undefined,
  });

  const handleChange = (event: SelectChangeEvent) => {
    setFilters({
      ...filters,
      sortBy: event.target.value,
    });
  };

  const handleFavoriteFilter = (event: ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      starred: event.target.value === "Yes",
    });
  };

  const handleResetFilter = () => {
    setFilters({
      starred: undefined,
      sortBy: undefined,
    });

    dispatch(getAllRecipes({}));
  };

  useEffect(() => {
    if (
      typeof filters.sortBy !== "undefined" ||
      typeof filters.starred !== "undefined"
    ) {
      dispatch(getAllRecipes(filters as RecipesFilter));
    }
  }, [filters, dispatch]);

  return (
    <Paper sx={{ p: 2, position: "sticky", top: "96px" }} elevation={3}>
      <Stack gap={2}>
        <FormControl fullWidth>
          <InputLabel id="sort-by-title">Sort by Title</InputLabel>
          <Select
            labelId="sort-by-title"
            id="sort-by-title"
            value={filters.sortBy || ""}
            label="Sort by Title"
            onChange={handleChange}
          >
            <MenuItem value="ASC">Ascending</MenuItem>
            <MenuItem value="DESC">Descending</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel id="filter-by-favorites">Favorites?</FormLabel>
          <RadioGroup
            aria-labelledby="filter-by-favorites"
            defaultValue="no"
            name="filter-by-favorites"
            onChange={handleFavoriteFilter}
            value={
              typeof filters.starred !== "undefined"
                ? filters.starred
                  ? "Yes"
                  : "No"
                : ""
            }
          >
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
        <Button
          size="small"
          onClick={handleResetFilter}
          sx={{ marginLeft: "auto" }}
        >
          Reset
        </Button>
      </Stack>
    </Paper>
  );
}
