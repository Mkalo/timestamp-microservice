import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { z } from 'zod';
import { cors } from 'hono/cors';

export const config = {
  runtime: 'edge',
};

export const app = new Hono({ strict: false }).basePath('/api');

app.use('/api/*', cors());

const dateParamsSchema = z.object({
  date: z.string().optional().transform((v) => v ? isNaN(Number(v)) ? new Date(v) : new Date(Number(v)) : new Date()),
});

app.get('/:date?',
  (c) => {
    const res = dateParamsSchema.safeParse(c.req.param());
    if (!res.success) {
      return c.json({ error: "Invalid Date" });
    }

    const date = res.data.date ?? new Date();

    return c.json({ 
      unix: date.getTime(),
      utc: date.toUTCString(),  
    });
  }
);

export default handle(app);
