import { IncomingMessage } from 'http';

export const parseJsonBody = (
  req: IncomingMessage,
): Promise<Record<string, unknown>> => new Promise((resolve, reject) => {
  let raw = '';

  req.on('data', (chunk) => {
    raw += chunk.toString();
  });

  req.on('end', () => {
    if (!raw.trim()) {
      resolve({});
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      resolve(parsed);
    } catch (err) {
      reject(err);
    }
  });

  req.on('error', (err) => {
    reject(err);
  });
});
