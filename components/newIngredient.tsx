import Link from "next/link";

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default function NewIngredient() {
  return (
    <>
      Não achou o ingrediente que você procura? <Link href={`${getBaseUrl()}/ingredient`} className="link">Cadastre-o aqui!</Link>
    </>
  );
}