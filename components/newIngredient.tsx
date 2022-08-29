import Link from "next/link";

export default function NewIngredient() {
  return (
    <>
      Não achou o ingrediente que você procura? <Link href='ingredient' replace className="link">Cadastre-o aqui!</Link>
    </>
  );
}