import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { z } from 'zod';
import { cors } from 'hono/cors';

export const config = {
  runtime: 'edge',
};

export const app = new Hono({ strict: false }).basePath('/api');

app.use('*', cors());

const dateParamsSchema = z.object({
  date: z.string().optional().transform((v, ctx) => {
    const timestamp = Number(v);
    const date = v ? new Date(isNaN(timestamp) ? v : timestamp) : new Date();

    if (isNaN(date.getTime())) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid Date" });
      return z.NEVER;
    }

    return date;
  }),
});

app.get('/:date?',
  (c) => {
    const res = dateParamsSchema.safeParse(c.req.param());
    if (!res.success) {
      return c.json({ error: "Invalid Date" });
    }

    const { date } = res.data;

    return c.json({ 
      unix: date.getTime(),
      utc: date.toUTCString(),  
    });
  }
);

export default handle(app);
