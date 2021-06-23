import { NextApiRequest, NextApiResponse } from 'next';
import nc, { NextHandler } from 'next-connect';
import UUID from 'pure-uuid';

import { imageFileNames, imageFilePaths } from './lib/imageFiles';
import { renderToBuffer } from './lib/imaging';
import FaceFactory, { Face } from './lib/FaceFactory';


interface NextConnectRequest extends NextApiRequest {
  params: Record<string, string | string[]>;
}

const resolveQueryParam = (param: string | string[]): string =>
  Array.isArray(param)
    ? param.pop()
    : param;

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

const sendRenderedFace = async (req: NextApiRequest, res: NextApiResponse, face: Face): Promise<void> => {
  const format = resolveQueryParam(req.query?.format ?? 'webp').toLowerCase();

  const contentType = validFormats.get(format);
  if (!contentType) {
    res.status(400).end('Bad Request');
    return;
  }

  const renderedFace = await renderToBuffer(face, format);
  res.setHeader('Expires', new Date(Date.now() + 604800000).toUTCString());
  res.setHeader('Content-Type', contentType);
  res.status(200).end(renderedFace);
};





const sendFaceList = (req: NextApiRequest, res: NextApiResponse): void => {
  const face = {};
  imageTypes.forEach(type => (face[type] = imageFileNames(type)));

  res.status(200).json({ face });
};


const sendRandomFace = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { size } = req.query;
  const face = FaceFactory.create((new UUID(4)).toString(), size as string);

  await sendRenderedFace(req, res, face);
};

const sendIdGeneratedFace = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { id, size } = req.query;
  const face = FaceFactory.create(id as string, size as string);

  await sendRenderedFace(req, res, face);
};

const imageTypes: (keyof Face)[] = ['eyes', 'nose', 'mouth'];
const sendSpecificFace = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { color, size } = req.query;
  const face = {
    color: resolveQueryParam(color).startsWith('#') ? color : `#${color}`,
    size,
  } as Face;

  imageTypes.forEach(type => {
    const requestedName = req.query[type] as string;
    const paths = imageFilePaths(type);
    face[type] = paths.find(path => !!path.match(requestedName)) || paths[0];

    if (requestedName === 'x') {
      face[type] = '';
    }
  });

  await sendRenderedFace(req, res, face);
};





const nextParamAdapter = (req: NextConnectRequest, res: NextApiResponse, next: NextHandler): void => {
  if (req.params && req.query) {
    req.query = {
      ...req.params,
      ...req.query,
    };
  }

  next();
};





const avatarsRouter = nc<NextApiRequest, NextApiResponse>({ attachParams: true });
avatarsRouter.use(nextParamAdapter);
avatarsRouter.get('/list', sendFaceList);
avatarsRouter.get('/random/:size?/:format?', sendRandomFace);
avatarsRouter.get('/:id/:size?/:format?', sendIdGeneratedFace);
avatarsRouter.get('/face/:eyes/:nose/:mouth/:color/:size?/:format?', sendSpecificFace);



export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  req.url = ['', ...req.query.slug].join('/'); // Removes base API path so the router can be mounted anywhere.

  return avatarsRouter(req, res);
};

export {
  avatarsRouter,
  sendFaceList,
  sendRandomFace,
  sendIdGeneratedFace,
  sendSpecificFace,
};
