type User = {
  id: number;
  name: string;
  email: string;
  role: string;
} | null;

type UserContextProps = {
  user: User;
  loginUser: (user: User) => void;
};

export type { User, UserContextProps };