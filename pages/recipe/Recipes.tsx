import React from "react";
import Link from "next/link";
import { NextPage } from "next"
import {
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  Select,
  FormControl,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ArrowCircleRight } from "@mui/icons-material";
import { trpc } from "../../utils/trpc";
import NewIngredient from "../../components/newIngredient";
import { UserContext } from "../../contexts/UserContext";
import UserOptions from "../../components/userOptions";

const Recipes: NextPage = () => {
  interface SearchIngredient {
    id: number;
    name: string | undefined;
    amount: number;
  };

  const [searchedIngredients, setSearchedIngredients] = React.useState<SearchIngredient[]>([]);
  const { user, loginUser } = React.useContext(UserContext);

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
      <UserOptions />

      <h1>Receitas</h1>

      <FormControl className="maxForm">
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

        <div>
          {searchedIngredients.length > 0 && searchedIngredients.map(({ id, name }) => (
            <Chip
              key={id}
              label={name}
              onDelete={() => setSearchedIngredients(searchedIngredients.filter(i => i.id !== id))}
              color="warning"
              className="generalMargin"
            />
          ))}
        </div>
        <br/>

        {!recipeResponse || !recipeResponse.data? (<p>Carregando...</p>) : recipeResponse.data?.map((recipe) => (
          <Accordion key={recipe.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>{recipe.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {recipe.ingredients.map(({ ingredient, amount }) => (
                  <p key={ingredient.id}>{ingredient.name} ({amount}), </p>
                ))}
                <Link href="/recipe/[id]" as={`/recipe/${recipe.id}`}>
                  Ler Mais...
                </Link>
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
        <br/>

      </FormControl>

      <div className="mb-1">
        <Link href="/recipe/new">
          <Button variant='contained' color='warning'>Criar receita</Button>
        </Link>
      </div>

      <NewIngredient />
    </>
  )
}

export default Recipes;