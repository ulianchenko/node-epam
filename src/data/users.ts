import { UserEntity, UserRole } from '../entities/user.entity';

// Predefined users - used by tests, modifying them will break test assertions

export const users: UserEntity[] = [
  {
    id: '7ed47722-4381-4d60-8619-7cc867e1f7ae',
    email: 'admin@admin.admin',
    password: '$2b$10$23Y3t/3ojY5/OMn5YMKtYec6fM1yE0POTNuWS3dmwOnbx.BL.pxgK', // raw value = admin
    role: UserRole.ADMIN,
  },
  {
    id: '087464cf-c88e-408b-889c-d9b881ca473d',
    email: 'bob@epam.com',
    password: '$2b$10$HVongz4L5WKjekytlVejjug8t9X4YO5n34o1ni/21M8hD7B/NUOiC', // raw value = bob
    role: UserRole.USER,
  },
  {
    id: '4e264f4b-2d65-4172-add3-ae9f185b00f8',
    email: 'alice@epam.com',
    password: '$2b$10$ruw917BEeUhJfDYtGAc4FOun0Hond2dV1Epk7sWSxQeQUyFIUi1JO', // raw value = alice
    role: UserRole.USER,
  },
];
