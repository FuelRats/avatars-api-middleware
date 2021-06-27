import http, { IncomingMessage, ServerResponse } from 'http';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import {
  getCookieParser,
  parseBody,
  redirect,
  sendData,
  sendJson,
  sendStatusCode,
  setLazyProp,
} from 'next/dist/next-server/server/api-utils';
import avatarsRouter from '../dist';

const port = Number(process.env.PORT) || 3002;


/**
 * Converts `IncomingMessage` and `ServerResponse` to `NextApiRequest` and `NextApiResponse` respectively, and forwards the request to the given request handler.
 *
 * **Limitations**:
 * - Assumes all requests are served by `/pages/api/[[...slug]].js`
 * - Env, preview, previewData, setPreviewData, and clearPreviewData are never defined.
 */
const nextApiAdapter = (router: NextApiHandler) =>
  async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const apiReq = req as NextApiRequest;
    const apiRes = res as NextApiResponse;

    setLazyProp({ req: apiReq }, 'cookies', getCookieParser(req));
    apiReq.query = {
      slug: req.url.replace('/api/', '').split('/'), // Dirty hack but it works
    };
    apiReq.body = await parseBody(apiReq, '10mb');

    apiRes.status = sendStatusCode.bind(this, apiRes);
    apiRes.send = sendData.bind(this, apiReq, apiRes);
    apiRes.json = sendJson.bind(this, apiRes);
    apiRes.redirect = redirect.bind(this, apiRes);


    return router(apiReq, apiRes);
  };

export default http
  .createServer(nextApiAdapter(avatarsRouter))
  .listen(port);
