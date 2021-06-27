import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import workerpool from 'workerpool';

import { imageFileNames } from './lib/imageFiles';
import FaceFactory, { Face, faceParts } from './lib/FaceFactory';
import { NCApiHandler, NCApiRequest, nextParamAdapter } from './lib/routeTools';

const validFormats = new Map([
  ['avif', 'image/avif'],
  ['gif', 'image/gif'],
  ['heic', 'image/heic'],
  ['heif', 'image/heic'],
  ['jpeg', 'image/jpeg'],
  ['jpg', 'image/jpeg'],
  ['png', 'image/png'],
  ['tiff', 'image/tiff'],
  ['webp', 'image/webp'],
]);

const imageFormatPool = workerpool.pool(require.resolve('./lib/imageWorker.js'));

const sendRenderedFace = async (req: NCApiRequest, res: NextApiResponse, face: Face): Promise<void> => {
  const contentType = validFormats.get(face.format);

  if (!contentType) {
    res.status(400).send('Bad Request');
    return;
  }

  const renderedFace = Buffer.from(await imageFormatPool.exec('renderToBuffer', [face]));

  res.setHeader('Expires', new Date(Date.now() + 604800000).toUTCString());
  res.setHeader('Content-Type', contentType);
  res.status(200).send(renderedFace);
};





const sendFaceList: NCApiHandler = (req, res) => {
  const face = {};
  faceParts.forEach(type => (face[type] = imageFileNames(type)));

  res.status(200).json({
    face,
    format: [ ...validFormats.keys() ],
  });
};

const sendSeededFace: NCApiHandler = async (req , res) => {
  await sendRenderedFace(req, res, FaceFactory.generate(req.query));
};

const sendDefinedFace: NCApiHandler = async (req, res) => {
  await sendRenderedFace(req, res, FaceFactory.define(req.query));
};

const sendRandomFace: NCApiHandler = async (req, res, next) => {
  req.query.seed = undefined; // Workaround for limitation of trouter.
  return sendSeededFace(req, res, next);
};







const avatarsRouter = (): NextApiHandler =>  {
  const router = nc<NextApiRequest, NextApiResponse>({ attachParams: true });
  router.use(nextParamAdapter);
  router.get('/list', sendFaceList);
  router.get('/random/:size?/:format?', sendRandomFace);
  router.get('/:seed/:size?/:format?', sendSeededFace);
  router.get('/face/:eyes/:nose/:mouth/:color/:size?/:format?', sendDefinedFace);

  return (req, res) => {
    req.url = ['', ...req.query.slug].join('/'); // Removes base API path so the router can be mounted anywhere.
    return router(req, res);
  };
};

export default avatarsRouter;
export {
  avatarsRouter,
  sendFaceList,
  sendSeededFace,
  sendDefinedFace,
};
