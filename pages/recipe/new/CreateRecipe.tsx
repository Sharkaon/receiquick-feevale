import React from "react";
import { NextPage } from "next";
import {
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  Select
} from "@mui/material";
import { trpc } from "../../../utils/trpc";

const CreateRecipe: NextPage = () => {
  interface SelectedIngredient {
    id: number;
    name: string | undefined;
    amount: number;
  };

  const [isInvalid, setIsInvalid] = React.useState(false);
  const [selectedIngredients, setSelectedIngredients] = React.useState<SelectedIngredient[]>([]);

  const mutation = trpc.useMutation(['recipe.createRecipe']);
  const res = trpc.useQuery(['ingredient.ingredients']);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
    };
    if (e.target instanceof EventTarget && target.name.value) {
      const formattedSelectedIngredients = selectedIngredients.map(ingredient => ({
        id: ingredient.id,
        amount: ingredient.amount
      }));
      mutation.mutate({ name: target.name.value, ingredients: formattedSelectedIngredients });
      setIsInvalid(false);
      target.name.value = '';
    } else {
      setIsInvalid(true);
    }
  }

  const handleIngredientChange = (e: SelectChangeEvent) => {
    const target = e.target as typeof e.target & {
      value: number;
    };
    const newSelectedIngredient = {
      id: Number.parseInt(target.value, 10),
      name: res.data?.find(i => i.id === Number.parseInt(target.value, 10))?.name,
      amount: 0
    }
    if (target.value) {
      setSelectedIngredients([...selectedIngredients, newSelectedIngredient]);
    }
  }

  return (
    <>
      <h1>Criar Receita</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Nome:</label><br/>
        <input type="text" name="name"/>
        <button type="submit">Criar</button>
        <InputLabel id="ingrediente">Ingredientes</InputLabel>
        <Select id="ingrediente" label-id="ingrediente" label="Ingrediente" onChange={handleIngredientChange}>
          {res.data?.map(({ id, name }) => (
            <MenuItem key={id} value={id}>{name}</MenuItem>
          ))}
        </Select>
        {selectedIngredients.length === 0 ? 'Nenhum Ingrediente Selecionado' : selectedIngredients.map(({ id, name, amount }) => (
          <div key={id}>
            <label>{name}</label>
            <input type="number" name="amount" value={amount} onChange={(e) => {
              const target = e.target as typeof e.target & {
                value: number;
              };
              if (e.target instanceof EventTarget && target.value) {
                setSelectedIngredients(selectedIngredients.map(i => i.id === id ? { ...i, amount: Number.parseInt(target.value, 10) } : i));
              }
            } }/>
          </div>
        ))}
      </form>
      {mutation.isLoading && <p>Carregando...</p>}
      {(isInvalid || mutation.isError) && <p>Preencha o nome</p>}
      {mutation.isSuccess && <p>Receita criada com sucesso</p>}
    </>
  );
}

export default CreateRecipe;