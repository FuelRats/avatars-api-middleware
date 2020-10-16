import { Context } from 'koa';
import Router from '@koa/router';
import UUID from 'pure-uuid';

import { imageFileNames, imageFilePaths } from '../lib/imageFiles';
import { render } from '../lib/imaging';
import FaceFactory, { Face } from '../lib/FaceFactory';





const imageTypes: (keyof Face)[] = ['eyes', 'nose', 'mouth'];
const router = new Router();

router.get('/list', (ctx: Context) => {
  const face = {};
  imageTypes.forEach(type => (face[type] = imageFileNames(type)));

  ctx.type = 'application/json';
  ctx.body = JSON.stringify({ face });
});

router.get('/:size?/random', async (ctx: Context) => {
  const { size } = ctx.params;
  const face = FaceFactory.create((new UUID(4)).toString(), size);

  ctx.res.setHeader('Expires', new Date(Date.now() + 604800000).toUTCString());
  ctx.type = 'image/png';
  ctx.body = await render(face);
});

router.get('/:size?/:id', async (ctx: Context) => {
  const { id, size } = ctx.params;
  const face = FaceFactory.create(id, size);

  ctx.res.setHeader('Expires', new Date(Date.now() + 604800000).toUTCString());
  ctx.type = 'image/png';
  ctx.body = await render(face);
});



router.get('/face/:eyes/:nose/:mouth/:color/:size?', async (ctx: Context) => {
  const { color, size } = ctx.params;
  const face = { color: `#${color}`, size } as Face;

  imageTypes.forEach(type => {
    const requestedName = ctx.params[type];
    const paths = imageFilePaths(type);
    face[type] = paths.find(path => !!path.match(requestedName)) || paths[0];

    if (requestedName === 'x') {
      face[type] = '';
    }
  });

  ctx.res.setHeader('Expires', new Date(Date.now() + 604800000).toUTCString());
  ctx.type = 'image/png';
  ctx.body = await render(face);
});

export default router;
