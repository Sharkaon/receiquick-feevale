import Link from "next/link";
// import { Button } from "@mui/material";

export default function NewIngredient() {
  return (
    <>
      Não achou o ingrediente que você procura? <Link href='ingredient' replace className="link">Cadastre-o aqui!</Link>
    </>
  );
}