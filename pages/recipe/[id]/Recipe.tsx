import { useState, useContext } from "react";
import { Button } from "@mui/material";
import { NextPage } from "next"
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Badge,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import { UserContext } from "../../../contexts/UserContext";
import { trpc } from "../../../utils/trpc";
import UserOptions from "../../../components/userOptions";
import DeleteRecipe from "../../../components/Recipes/deleteRecipe";

const Recipe: NextPage = () => {
  const [ comment, setComment ] = useState("");
  const [ loadingComments, setLoadingComments ] = useState(true);
  const { user, loginUser } = useContext(UserContext);

  const router = useRouter();
  const { id } = router.query as { id: string };
  const trpcUtils = trpc.useContext();

  const res = trpc.useQuery(['recipe.recipe', { id: parseInt(id, 10) }], {
    onSuccess: () => setLoadingComments(false)
  });
  const createCommentMutation = trpc.useMutation(['comment.createComment'], {
    onSuccess: () => {
      trpcUtils.invalidateQueries(['recipe.recipe', { id: parseInt(id, 10) }]);
    },
  });

  const handleSubmitComment: React.FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingComments(true);
    createCommentMutation.mutate({
      recipeId: parseInt(id, 10),
      userId: user ? user.id : 1,
      description: comment,
    });
  }

  return (
    <>
      <UserOptions />
      <Link href="/recipe">
        <Button>Voltar</Button>
      </Link>
      <h1>{!res || !res?.data ? 'Carregando...' : res?.data?.name}</h1>

      <h4>Ingredientes:</h4>
      <div>
        {res?.data?.ingredients?.map(i => (
          <Badge key={i.ingredient.id} badgeContent={i.amount} color="primary" className="generalMargin">
            <Chip label={i.ingredient.name} color="warning"/>
          </Badge>
        ))}
      </div>
      <br/>

      <List className="maxList">
        {res?.data?.Steps?.map((s, index) => (
          <>
            <ListItem key={s.id}>
              <ListItemIcon>{index + 1}</ListItemIcon>
              <ListItemText primary={s.description} />
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
      <div className="grouper">
        <DeleteRecipe id={parseInt(id, 10)} />
        <Link href={{
          pathname: '/recipe/[id]/edit',
          query: { id }
        }}>
          <Button variant="contained" color="warning">Editar</Button>
        </Link>
      </div>
      
      <h2>Comentários</h2>
      {user && user.id && (
        <div className="mb-1">
          <h3>Insira um comentário</h3>
          <form onSubmit={handleSubmitComment}>
            <textarea name="comment" id="comment" cols={30} rows={10} onChange={(e) => setComment(e.target.value)} />
            <Button variant="contained" type="submit">Enviar</Button>
          </form>
        </div>
      )}

      {res?.data?.comments?.map(c => (
        <>
          <ListItem key={c.id}>
            <ListItemIcon>{c.user?.name}</ListItemIcon>
            <ListItemText primary={c.description} />
          </ListItem>
          <Divider />
        </>
      ))}

      {loadingComments && <p>Carregando comentários...</p>}
    </>
  );
}

export default Recipe;