import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from 'next/link';
import {
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  Select,
  Button,
} from "@mui/material";
import { trpc } from "../../../utils/trpc";
import NewIngredient from "../../../components/newIngredient";
import UserOptions from "../../../components/userOptions";

const CreateRecipe: NextPage = () => {
  type SelectedIngredient = {
    id: number;
    name: string | undefined;
    amount: number;
  };

  type Step =  {
    id: number;
    description: string;
  };

  const [isInvalid, setIsInvalid] = React.useState(false);
  const [selectedIngredients, setSelectedIngredients] = React.useState<SelectedIngredient[]>([]);
  const [steps, setSteps] = React.useState<Step[]>([]);

  const router = useRouter();

  const mutation = trpc.useMutation(['recipe.createRecipe'], {
    onSuccess() {
      setTimeout(() => {
        router.back();
      }, 1000);
    }
  });
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
      if (formattedSelectedIngredients.length > 0) {
        const isValidMutation = formattedSelectedIngredients.every(ingredient => {
          if (ingredient.amount === 0) {
            setIsInvalid(true);
            return false;
          } else {
            return true;
          }
        });

        if (isValidMutation) {
          mutation.mutate({
            name: target.name.value,
            ingredients: formattedSelectedIngredients,
            steps: steps
          });
        }
      } else {
        setIsInvalid(true);
      }
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
    if (target.value && !selectedIngredients.find(i => i.id === newSelectedIngredient.id)) {
      setSelectedIngredients([...selectedIngredients, newSelectedIngredient]);
    }
  }

  const setNewSelectedIngredient = (e: SelectChangeEvent, id: number) => { 
    const target = e.target as typeof e.target & {
      value: number;
    };
    if (e.target instanceof EventTarget && target.value) {
      const selectedAmount = Number.parseInt(target.value, 10) || 0;
      if (selectedAmount !== 0) {
        setSelectedIngredients(selectedIngredients.map(i => i.id === id ? { ...i, amount: selectedAmount} : i));
      } else {
        setIsInvalid(true);
      }
    }
  }

  const handleStepValueChange = (e: SelectChangeEvent, id: number) => {
    const target = e.target as typeof e.target & {
      value: string;
    };
    if (e.target instanceof EventTarget && target.value) {
      setSteps(steps.map(s => s.id === id ? { ...s, description: e.target.value } : s));
    }
  }

  const handleNewStep = () => {
    setSteps([...steps, { id: steps.length, description: '' }]);
  }

  return (
    <>
      <UserOptions />
      <Link href="/recipe">
        <Button>Voltar</Button>
      </Link>
      <h1>Criar Receita</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Nome:</label>
        <input type="text" name="name"/>
        <br/>

        <InputLabel id="ingrediente">Ingredientes</InputLabel>
        <Select id="ingrediente" label-id="ingrediente" label="Ingrediente" onChange={handleIngredientChange}>
          {res.data?.map(({ id, name }) => (
            <MenuItem key={id} value={id}>{name}</MenuItem>
          ))}
        </Select>
        {selectedIngredients.length > 0 && selectedIngredients.map(({ id, name, amount }) => (
          <div key={id}>
            <label>{name}</label>
            <input type="number" name="amount" value={amount} onChange={(e) => setNewSelectedIngredient(e, id)}/>
          </div>
        ))}
        <br/>
        {steps.length > 0 && steps.map(({ id, description }) => (
          <div key={id}>
            <label>Passo {id + 1}</label>
            <input type="text" name="description" value={description} onChange={(e) => handleStepValueChange(e, id)}/>
          </div>
        ))}
        <Button variant="contained" onClick={handleNewStep}>Adicionar Passo</Button>

        <br/><Button type="submit" variant="contained">Criar</Button>
      </form>
      {mutation.isLoading && <p>Carregando...</p>}
      {(isInvalid || mutation.isError) && <p>Necessário Nome, Ingredientes</p>}
      {mutation.isSuccess && <p>Receita criada com sucesso</p>}

      <NewIngredient />
    </>
  );
}

export default CreateRecipe;