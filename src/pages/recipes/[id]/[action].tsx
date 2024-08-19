import RecipeForm from "@/components/RecipeForm"
import { getRecipeById } from "@/slices/recipes/recipes-thunk"
import { AppDispatch } from "@/store"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

export default function ViewEditRecipe() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (router.query.id) {
      dispatch(getRecipeById(router.query.id as string))
    }
  }, [dispatch, router])

  return (
    <RecipeForm />
  )
}