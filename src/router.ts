import { IncomingMessage, ServerResponse } from 'http';
import { parseJsonBody } from './utils/body-parser';
import {
  handleCreateUser,
  handleDeleteUser,
  handleGetHobbies,
  handleGetUsers,
  handleUpdateHobbies,
} from './controllers/users.controller';

const sendJson = (res: ServerResponse, statusCode: number, payload: unknown): void => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};

export const routeRequest = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const method = req.method || 'GET';
  const urlPath = (req.url || '/').split('?')[0];

  if (urlPath === '/api/users' && method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      handleCreateUser(res, body);
    } catch {
      sendJson(res, 400, { data: null, error: 'Invalid JSON body' });
    }
    return;
  }

  if (urlPath === '/api/users' && method === 'GET') {
    handleGetUsers(res);
    return;
  }

  const userMatch = urlPath.match(/^\/api\/users\/([^/]+)$/);
  if (userMatch && method === 'DELETE') {
    const userId = decodeURIComponent(userMatch[1]);
    handleDeleteUser(res, userId);
    return;
  }

  const hobbiesMatch = urlPath.match(/^\/api\/users\/([^/]+)\/hobbies$/);
  if (hobbiesMatch && method === 'GET') {
    const userId = decodeURIComponent(hobbiesMatch[1]);
    handleGetHobbies(res, userId);
    return;
  }

  if (hobbiesMatch && method === 'PATCH') {
    const userId = decodeURIComponent(hobbiesMatch[1]);
    try {
      const body = await parseJsonBody(req);
      handleUpdateHobbies(res, userId, body);
    } catch {
      sendJson(res, 400, { data: null, error: 'Invalid JSON body' });
    }
    return;
  }

  sendJson(res, 404, { data: null, error: 'Not found' });
};
