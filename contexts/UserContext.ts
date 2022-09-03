import React from "react";
import type { UserContextProps, User } from "../types/UserTypes";

export const UserContext = React.createContext<UserContextProps>({
  user: null,
  loginUser: (user: User) => {},
});