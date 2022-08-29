import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function UserOptions() {
  const { user, loginUser } = useContext(UserContext);
  const router = useRouter();

  const logout = () => {
    loginUser(null);
    router.push("/");
  }

  return (
    <>
      {user && (
        <>
          <h2>Bem vindo, {user?.name || 'Visitante'}</h2>
          <div className="grouper">
            <Button variant="contained" color="error" onClick={() => logout()}>Sair</Button>

            {user.role == 'ADMIN' && (
              <>
                <Link href="/admin">
                  <Button variant="contained" color="primary">Admin</Button>
                </Link>
              </>
            )}
          </div>
        </>
      )}

      {!user && (
        <>
          <h2>Bem vindo, Visitante</h2>
          <Button variant="contained" color="primary" href="/">Entrar</Button>
        </>
      )}
    </>
  );
}