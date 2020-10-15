import { Context } from 'koa';
import Router from '@koa/router';
import uuid from 'uuid';

import { imageFileNames, imageFilePaths } from '../lib/imageFiles';
import { combine, resize } from '../lib/imaging';
import FaceFactory, { Face } from '../lib/FaceFactory';

const imageTypes: (keyof Face)[] = ['eyes', 'nose', 'mouth'];

const router = new Router();


const pngResponse = (ctx: Context) => {
  ctx.res.setHeader('Expires', new Date(Date.now() + 604800000).toUTCString());
  ctx.type = 'image/png';
  return ctx.data;
};

router.get('/list', (ctx: Context) => {
  const face = {};
  imageTypes.forEach(type => (face[type] = imageFileNames(type)));

  ctx.type = 'application/json';
  ctx.body = JSON.stringify({ face });
});

router.get('/:size?/random', (ctx: Context) => {
  const { size } = ctx.query;
  const face = FaceFactory.create(uuid.v4());

  ctx.body = combine(face)
    .png()
    .pipe(resize(size))
    .pipe(pngResponse(ctx));

});

router.get('/:size?/:id', (ctx: Context) => {
  const { id, size } = ctx.query;
  const face = FaceFactory.create(id);

  ctx.body = combine(face)
    .png()
    .pipe(resize(size))
    .pipe(pngResponse(ctx));
});

router.get('/face/:eyes/:nose/:mouth/:color/:size?', (ctx: Context) => {
  const { color, size } = ctx.query;
  const face = { color: `#${color}` } as Face;

  imageTypes.forEach(type => {
    const requestedName = ctx.query[type];
    const paths = imageFilePaths(type);
    face[type] = paths.find(path => !!path.match(requestedName)) || paths[0];

    if (requestedName === 'x') {
      face[type] = '';
    }
  });

  combine(face)
    .png()
    .pipe(resize(size))
    .pipe(pngResponse(ctx));
});

export default router;
