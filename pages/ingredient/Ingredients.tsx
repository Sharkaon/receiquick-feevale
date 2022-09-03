import { useContext } from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import { trpc } from '../../utils/trpc';
import {
  Button,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import UserOptions from '../../components/userOptions';
import { UserContext } from '../../contexts/UserContext';

const Ingredients: NextPage = () => {
  const res = trpc.useQuery(['ingredient.ingredients']);
  const { user, loginUser } = useContext(UserContext);

  return (
    <div className="ingredient-bg">
      <UserOptions />
      <h1>Ingredientes!</h1>

      <Link href="recipe">
        Voltar
      </Link>

      <Link href="/ingredient/new">
        <Button variant='contained'>Cadastrar novo ingrediente</Button>
      </Link>

      {!res || !res.data && 'Carregando...'}

      {res && res.data && (
        <div>
          {user && user.role === 'ADMIN' && res.data?.map((ingredient) => (
            <Link key={ingredient.id} href={{
              pathname: '/ingredient/[id]',
              query: { id: ingredient.id }
            }}>
              <Accordion key={ingredient.id} className="generalMargin">
                <AccordionSummary
                  expandIcon={<ArrowForwardIosIcon />}
                >
                  <Typography>{ingredient.name}</Typography>
                </AccordionSummary>
                <AccordionDetails />
              </Accordion>
            </Link>
          ))}
          {(!user || user.role !== 'ADMIN') && res.data?.map((ingredient) => (
            <Accordion key={ingredient.id} className="generalMargin">
              <AccordionSummary>
                <Typography>{ingredient.name}</Typography>
              </AccordionSummary>
              <AccordionDetails />
            </Accordion>
          ))}
        </div>
      )}
      
    </div>
  );
}

export default Ingredients