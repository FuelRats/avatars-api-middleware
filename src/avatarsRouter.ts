import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import UUID from 'pure-uuid';
import workerpool from 'workerpool';

import { imageFileNames } from './lib/imageFiles';
import FaceFactory, { Face, faceParts } from './lib/FaceFactory';
import { nextParamAdapter, nextSlugUrlAdapter, resolveQueryParam } from './lib/routeTools';




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

const imageFormatPool = workerpool.pool(require.resolve(`${__dirname}/lib/imageWorker.js`));

const sendRenderedFace = async (req: NextApiRequest, res: NextApiResponse, face: Face): Promise<void> => {
  const format = face.format;

  const contentType = validFormats.get(format);
  if (!contentType) {
    res.status(400).end('Bad Request');
    return;
  }

  const renderedFace = Buffer.from(await imageFormatPool.exec('renderToBuffer', [face]));
  res.setHeader('Expires', new Date(Date.now() + 604800000).toUTCString());
  res.setHeader('Content-Type', contentType);
  res.status(200).end(renderedFace);
};





const sendFaceList = (req: NextApiRequest, res: NextApiResponse): void => {
  const face = {};
  faceParts.forEach(type => (face[type] = imageFileNames(type)));

  res.status(200).json({
    face,
    format: [ ...validFormats.keys() ],
  });
};

const sendSeededFace = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { id, size, format } = req.query;

  await sendRenderedFace(
    req,
    res,
    FaceFactory.generate(
      resolveQueryParam(id),
      resolveQueryParam(size),
      resolveQueryParam(format)
    )
  );
};

const sendRandomFace = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  req.query.id = (new UUID(4)).toString();
  return sendSeededFace(req, res);
};

const sendDefinedFace = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  await sendRenderedFace(req, res, FaceFactory.define(req.query));
};





const router = nc<NextApiRequest, NextApiResponse>({ attachParams: true });
router.use(nextParamAdapter);
router.get('/list', sendFaceList);
router.get('/random/:size?/:format?', sendRandomFace);
router.get('/:id/:size?/:format?', sendSeededFace);
router.get('/face/:eyes/:nose/:mouth/:color/:size?/:format?', sendDefinedFace);


const avatarsRouter = nextSlugUrlAdapter(router);

export default avatarsRouter;
export {
  avatarsRouter,
  sendFaceList,
  sendRandomFace,
  sendSeededFace,
  sendDefinedFace,
};
