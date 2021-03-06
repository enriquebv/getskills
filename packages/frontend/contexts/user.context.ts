import { createContext, Dispatch, SetStateAction, useState } from "react";

interface UserContextInterface {
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
}

export const UserContext = createContext<UserContextInterface>({} as any);
