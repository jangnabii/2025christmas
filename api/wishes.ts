// api/wishes.ts
import { kv } from '@vercel/kv';

const WISHES_KEY = 'wishes';

export default async function handler(request: Request) {
  // GET: Fetch all wishes
  if (request.method === 'GET') {
    try {
      const wishes = await kv.lrange(WISHES_KEY, 0, -1);
      return new Response(JSON.stringify(wishes), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error(error);
      return new Response('Failed to fetch wishes.', { status: 500 });
    }
  }

  // POST: Add a new wish
  if (request.method === 'POST') {
    try {
      const { wish } = await request.json();
      if (typeof wish !== 'string' || wish.trim() === '') {
        return new Response('Wish text cannot be empty.', { status: 400 });
      }
      await kv.lpush(WISHES_KEY, wish.trim());
      return new Response('Wish added successfully.', { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response('Failed to add wish.', { status: 500 });
    }
  }

  // Handle other methods
  return new Response(`Method ${request.method} Not Allowed`, {
    status: 405,
    headers: { Allow: 'GET, POST' },
  });
}