import { User } from '../types/user';

// Predefined users - used by tests, modifying them will break test assertions

export const users: User[] = [
  {
    id: 'fec436a5-8af8-4960-be91-911e73b8c010',
    name: 'john',
    email: 'john@john.john',
    hobbies: ['reading'],
  },
  {
    id: '044ad016-c6a6-4002-981b-d6f56f1b0eb2',
    name: 'ann',
    email: 'ann@ann.ann',
    hobbies: ['sport', 'dancing'],
  },
  {
    id: '732bb256-8e4f-4f07-bd9d-ec89079ffa7d',
    name: 'bob',
    email: 'bob@bob.bob',
    hobbies: [],
  },
];
