import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { SyntheticEvent, useState } from "react";
import { getAllRecipes } from "@/slices/recipes/recipes-thunk";
import { useRouter } from "next/router";
import Link from "next/link";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function AppAppBar() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    dispatch(getAllRecipes({ q: event.target.value }));
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar sx={{ padding: "0 !important" }}>
          <Typography
            variant="h6"
            component={Link}
            sx={{ flexGrow: 1, textDecoration: "none", color: "white" }}
            href="/"
          >
            AllRecipes!
          </Typography>
          {router.asPath === "/" && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchQuery}
                onChange={handleSearch}
              />
            </Search>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
