/* eslint-disable no-shadow */

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface UserEntity {
  id: string; // uuid
  email: string;
  password: string;
  role: UserRole,
}

// const user: UserEntity = {
//   id: '7ed47722-4381-4d60-8619-7cc867e1f7ae',
//   email: 'admin@admin.admin',
//   password: '$2b$10$23Y3t/3ojY5/OMn5YMKtYec6fM1yE0POTNuWS3dmwOnbx.BL.pxgK', // raw value = admin
//   role: UserRole.ADMIN,
// };
