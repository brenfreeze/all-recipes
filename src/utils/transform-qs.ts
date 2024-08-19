import { RecipesFilter } from "@/slices/recipes/recipes-thunk";

export default function transformFilterToQueryString(
  filter: RecipesFilter
): string {
  const params = [];
  if (filter.q) {
    params.push(`q=${filter.q}`);
  }
  if (filter.starred !== undefined) {
    params.push(`starred=${filter.starred}`);
  }
  if (filter.sortBy) {
    params.push(`sortBy=${filter.sortBy}`);
  }
  return params.join("&");
}
