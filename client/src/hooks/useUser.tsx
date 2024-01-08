import { useState } from "react";
import { Server } from "../clients";
import { CreateUserResponse } from "../models";

const useUser = () => {
  const [userId, setUserId] = useState<number>();
  const storageKey = 'user';

  const shouldCreate = async () => {
    const userId = localStorage.getItem(storageKey);
    if (userId) {
      setUserId(+JSON.parse(userId));
      return;
    }

    const { id } = await Server.post<CreateUserResponse>('/users').then(({ data }) => data);
    setUserId(id);
    localStorage.setItem(storageKey, `${id}`);
  };

  return {
    shouldCreate,
    userId,
  }
};

export default useUser;
