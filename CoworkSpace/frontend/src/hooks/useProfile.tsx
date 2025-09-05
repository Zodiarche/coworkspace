import { useState, useEffect } from "react";
import { useAuth } from "../contexts/auth";
import { Member } from "../types/member";

export type UpdateMemberInput = Omit<Member, "id" | "isManager"> & {
  password?: string;
};

export const useProfile = () => {
  const { user, update } = useAuth();

  const [tempUser, setTempUser] = useState<UpdateMemberInput>();

  // si `user` change dans le contexte, on met à jour le state local
  useEffect(() => {
    setTempUser(user!);
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setTempUser((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { id, isManager, ...updatedUser } = tempUser as Member;
    update(updatedUser);
  };

  return { tempUser, handleChange, handleSubmit };
};
