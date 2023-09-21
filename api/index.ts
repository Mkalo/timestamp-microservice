import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

export const config = {
  runtime: 'edge',
};

export const app = new Hono().basePath('/api');

app.get('/', (c) => c.json({ message: 'Hello Hono!' }));

app.get('/hello/:name',
  zValidator('param', z.object({
    name: z.string().min(3),
  })),
  (c) => {
    return c.json({ message: `Hello, ${c.req.param("name")}!` })
  }
);

export default handle(app);
