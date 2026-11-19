import { ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import {
  addUser,
  deleteUserById,
  findUserById,
  getAllUsers,
  updateUserHobbies,
} from '../store/users.store';
import {
  HobbiesResponse,
  User, UserPartial,
  UserResponse,
} from '../types/user';

const sendJson = (
  res: ServerResponse,
  statusCode: number,
  payload: unknown,
  headers: Record<string, string> = {},
): void => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    ...headers,
  });
  res.end(JSON.stringify(payload));
};

const formatUserResponse = (user: User): UserResponse => ({
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
  },
  links: {
    self: `/api/users/${user.id}`,
    hobbies: `/api/users/${user.id}/hobbies`,
  },
});

const formatHobbiesResponse = (user: User): HobbiesResponse => ({
  hobbies: user.hobbies,
  links: {
    self: `/api/users/${user.id}/hobbies`,
    user: `/api/users/${user.id}`,
  },
});

export const handleCreateUser = (res: ServerResponse, body: Record<string, unknown>): void => {
  const { name, email } = body as Partial<UserPartial>;
  const newUser: User = {
    id: uuidv4(),
    name: name ?? '',
    email: email ?? '',
    hobbies: [],
  };

  addUser(newUser);
  sendJson(res, 201, {
    data: formatUserResponse(newUser),
    error: null,
  });
};

export const handleGetUsers = (res: ServerResponse): void => {
  const data = getAllUsers().map(formatUserResponse);
  sendJson(
    res,
    200,
    {
      data,
      error: null,
    },
    {
      'Cache-Control': 'public, max-age=3600',
    },
  );
};

export const handleDeleteUser = (res: ServerResponse, userId: string): void => {
  const deleted = deleteUserById(userId);
  if (!deleted) {
    sendJson(res, 404, {
      data: null,
      error: `User with id ${userId} doesn't exist`,
    });
    return;
  }

  sendJson(res, 200, {
    data: { success: true },
    error: null,
  });
};

export const handleGetHobbies = (res: ServerResponse, userId: string): void => {
  const user = findUserById(userId);
  if (!user) {
    sendJson(res, 404, {
      data: null,
      error: `User with id ${userId} doesn't exist`,
    });
    return;
  }

  sendJson(
    res,
    200,
    {
      data: formatHobbiesResponse(user),
      error: null,
    },
    {
      'Cache-Control': 'private, max-age=3600',
    },
  );
};

export const handleUpdateHobbies = (
  res: ServerResponse,
  userId: string,
  body: Record<string, unknown>,
): void => {
  const hobbiesInput = Array.isArray(body.hobbies)
    ? body.hobbies.filter((item): item is string => typeof item === 'string')
    : [];

  const updatedUser = updateUserHobbies(userId, hobbiesInput);
  if (!updatedUser) {
    sendJson(res, 404, {
      data: null,
      error: `User with id ${userId} doesn't exist`,
    });
    return;
  }

  sendJson(res, 200, {
    data: formatHobbiesResponse(updatedUser),
    error: null,
  });
};
