import React from "react";
import Link from "next/link";
import { NextPage } from "next"
import {
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  Select,
  FormControl,
  Button
} from "@mui/material";
import { trpc } from "../../utils/trpc";

const Recipes: NextPage = () => {
  interface SearchIngredient {
    id: number;
    name: string | undefined;
  };

  const [searchedIngredients, setSearchedIngredients] = React.useState<SearchIngredient[]>([]);

  const recipeResponse = trpc.useQuery(['recipe.recipes', searchedIngredients]);
  const ingredientResponse = trpc.useQuery(['ingredient.ingredients']);

  const handleIngredientChange = (e: SelectChangeEvent) => {
    const target = e.target as typeof e.target & {
      value: number;
    };

    const ingredientOnList = ingredientResponse.data?.find(i => i.id === Number.parseInt(target.value, 10));

    if (!searchedIngredients?.find(i => i.id === Number.parseInt(target.value, 10))) {
      const newSearchedIngredient = {
        id: Number.parseInt(target.value, 10),
        name: ingredientOnList?.name,
        amount: 0
      }
      if (target.value) {
        setSearchedIngredients([...searchedIngredients, newSearchedIngredient]);
      }
    }
  }

  return (
    <>
      <h1>Receitas</h1>

      <FormControl>
        <InputLabel id="ingrediente-label">Ingrediente</InputLabel>
        <Select
          id="ingrediente"
          labelId="ingrediente-label"
          label="Ingrediente" 
          onChange={handleIngredientChange}
        >
          {ingredientResponse.data?.map(({ id, name }) => (
            <MenuItem key={id} value={id}>{name}</MenuItem>
          ))}
        </Select>
        <br/>

        {searchedIngredients.length === 0 ? 'Nenhum Ingrediente Selecionado' : searchedIngredients.map(({ id, name }) => (
          <div key={id}>
            <label>{name}</label><Button color="error" onClick={() => setSearchedIngredients(searchedIngredients.filter(i => i.id !== id))}>X</Button>
          </div>
        ))}
        <br/>

        {!recipeResponse || !recipeResponse.data? 'Carregando...' : recipeResponse.data?.map((recipe) => (
          <Link key={recipe.id} href={{
            pathname: '/recipe/[id]',
            query: { id: recipe.id }
          }}>
            <a><li key={recipe.id}>{recipe.name}</li></a>
          </Link>
        ))}
        <br/>

      </FormControl>
      <Link href="/recipe/new">
        <a><h4>Criar receita</h4></a>
      </Link>
    </>
  )
}

export default Recipes;