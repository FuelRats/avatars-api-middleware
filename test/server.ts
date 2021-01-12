import Koa from 'koa';
import Router from '@koa/router';

import avatarsRouter from '../src/router';

const app = new Koa();
const port = Number(process.env.PORT) || 3002;
const router = new Router();

router.use('/avatars', avatarsRouter.routes(), avatarsRouter.allowedMethods());

app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(port, () =>
  console.log(`[Adorable Avatars] Running at: http://localhost:${port}`),
);

export default server;
