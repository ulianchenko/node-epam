import http from 'http';
import { routeRequest } from './router';

const PORT = process.env.PORT || 8000;

const server = http.createServer(async (req, res) => {
  await routeRequest(req, res);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
