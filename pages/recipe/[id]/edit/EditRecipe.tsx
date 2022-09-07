import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  InputLabel,
  MenuItem,
  Select,
  Button,
  TextField,
} from "@mui/material";
import { trpc } from "../../../../utils/trpc";
import UserOptions from "../../../../components/userOptions";
import DeleteRecipe from "../../../../components/Recipes/deleteRecipe";

const EditRecipe: NextPage = () => {
  type SelectedIngredient = {
    id: number;
    name: string | undefined;
    amount: number;
  };

  type Steps = {
    id: number;
    description: string;
  };

  const [isInvalid, setIsInvalid] = React.useState(false);
  const [selectedIngredients, setSelectedIngredients] = React.useState<SelectedIngredient[]>([]);
  const [steps, setSteps] = React.useState<Steps[]>([]);

  const router = useRouter();
  const { id } = router.query as { id: string };

  const res = trpc.useQuery(['recipe.recipe', { id: parseInt(id, 10) }]);
  React.useEffect(() => {
    setSelectedIngredients(res?.data?.ingredients ? res?.data.ingredients.map(i => ({
      id: i.ingredient.id,
      name: i.ingredient.name,
      amount: i.amount
    })) : []);

    setSteps(res?.data?.Steps ? res?.data.Steps.map(s => ({
      id: s.id,
      description: s.description
    })) : []);
  }, []);

  const ingredientResponse = trpc.useQuery(['ingredient.ingredients']);

  const editMutation = trpc.useMutation(['recipe.updateRecipe'], {
    onSuccess() {
      setTimeout(() => {
        router.back();
      }, 1000);
    }
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
    };
    if (e.target instanceof EventTarget && target.name.value) {
      const formattedSelectedIngredients = selectedIngredients.map((ingredient) => {
        if (ingredient !== undefined) {
          return {
            id: ingredient.id,
            amount: ingredient.amount
          }
        }
      });
      if (formattedSelectedIngredients !== undefined && formattedSelectedIngredients?.length > 0) {
        const isValidMutation = formattedSelectedIngredients?.every(ingredient => {
          if (ingredient?.amount === 0) {
            setIsInvalid(true);
            return false;
          } else {
            return true;
          }
        });

        if (isValidMutation) {
          editMutation.mutate({
            id: parseInt(id, 10),
            data: {
              name: target.name.value,
              ingredients: formattedSelectedIngredients as SelectedIngredient[],
              steps: steps as Steps[]
            }
          });
        }
      } else {
        setIsInvalid(true);
      }
    } else {
      setIsInvalid(true);
    }
  }

  const handleIngredientChange = (e: any) => {
    const target = e.target as typeof e.target & {
      value: number;
    };
    const newSelectedIngredient = {
      id: Number.parseInt(target.value, 10),
      name: ingredientResponse.data?.find(i => i.id === Number.parseInt(target.value, 10))?.name,
      amount: 0
    }
    if (target.value && !selectedIngredients.find(i => i.id === newSelectedIngredient.id)) {
      setSelectedIngredients([...selectedIngredients, newSelectedIngredient]);
    }
  }

  const setNewSelectedIngredientAmount = (e: any, id: number) => {
    const target = e.target as typeof e.target & {
      value: number;
    };
    if (e.target instanceof EventTarget && target.value) {
      const selectedAmount = Number.parseInt(target.value, 10) || 0;
      if (selectedAmount !== 0) {
        setSelectedIngredients(selectedIngredients.map(i => i.id === id ? { ...i, amount: selectedAmount} : i));
        setIsInvalid(false);
      } else {
        setIsInvalid(true);
      }
    }
  }

  const handleStepChange = (e: any, id: number) => {
    setSteps(steps.map(s => s.id === id ? { ...s, description: e.target.value } : s))
  }

  return (
    <div className="recipe-bg">
      <UserOptions />
      <h1>Editar Receita</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <TextField
          label="Nome"
          name="name"
          defaultValue={res?.data?.name}
          className="generalMargin"/>
        <br/>

        <InputLabel id="ingrediente">Ingredientes</InputLabel>
        <Select id="ingrediente" label-id="ingrediente" label="Ingrediente" onChange={handleIngredientChange}>
          {ingredientResponse.data?.map(({ id, name }) => (
            <MenuItem key={id} value={id}>{name}</MenuItem>
          ))}
        </Select>
        {res?.data?.ingredients !== undefined && res?.data?.ingredients?.length > 0 && res?.data?.ingredients?.map(({ ingredient, amount }) => (
          <div key={ingredient.id}>
            <TextField
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              label={ingredient.name}
              name="amount"
              value={amount}
              onChange={(e) => setNewSelectedIngredientAmount(e, parseInt(id, 10))}
              className="generalMargin"
            />
          </div>
        ))}
        <br/>
        {steps !== undefined && steps?.length > 0 && steps?.map(({ id, description }, index) => (
          <div key={index}>
            <TextField
              label={`Passo ${index + 1}`}
              type="text"
              name="description"
              value={description}
              onChange={(e) => handleStepChange(e, id)}
              className="generalMargin"
            />
          </div>
        ))}
        <br/>

        <br/><Button type="submit" variant="contained">Editar</Button>
      </form>
      {editMutation.isLoading && <p>Carregando...</p>}
      {(isInvalid || editMutation.isError) && <p>Necessário Nome, Ingredientes</p>}
      {editMutation.isSuccess && <p>Receita editada com sucesso</p>}
      <br/>
      <DeleteRecipe id={parseInt(id, 10)} />
    </div>
  );
}

export default EditRecipe;