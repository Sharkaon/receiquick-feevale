import Link from "next/link";
import { Button } from "@mui/material";

export default function NewIngredient() {
  return (
    <>
      <Link href='ingredient' replace>
        <Button variant='contained'>Não achou o ingrediente que você procura? Cadastre-o aqui!</Button>
      </Link>
    </>
  );
}