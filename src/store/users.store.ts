import { users } from '../data/users';
import { User } from '../types/user';

const usersStore: User[] = [...users];

export const getAllUsers = (): User[] => usersStore;

export const findUserById = (id: string): User | undefined => usersStore
  .find((user) => user.id === id);

export const addUser = (user: User): User => {
  usersStore.push(user);
  return user;
};

export const deleteUserById = (id: string): boolean => {
  const index = usersStore.findIndex((user) => user.id === id);
  if (index === -1) {
    return false;
  }
  usersStore.splice(index, 1);
  return true;
};

export const updateUserHobbies = (id: string, newHobbies: string[]): User | undefined => {
  const user = findUserById(id);
  if (!user) {
    return undefined;
  }

  user.hobbies = Array.from(new Set([...user.hobbies, ...newHobbies]));
  return user;
};
