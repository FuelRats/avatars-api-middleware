import { NextApiRequest, NextApiResponse } from 'next';
import { NextConnect, NextHandler } from 'next-connect';

interface NextConnectRequest extends NextApiRequest {
  params: Record<string, string | string[]>;
}

export const resolveQueryParam = (param: string | string[], defValue?: string): string => (
  Array.isArray(param)
    ? param.pop()
    : param
) ?? defValue;

export const nextParamAdapter = (req: NextConnectRequest, res: NextApiResponse, next: NextHandler): void => {
  if (req.params) {
    req.query = {
      ...req.params,
      ...(req.query ?? {}),
    };
  }

  next();
};


export function nextSlugUrlAdapter<Req extends NextApiRequest, Res extends NextApiResponse, Func extends NextConnect<Req, Res>>(func: Func) {
  return (req: Req, res: Res): Promise<void> => {
    req.url = ['', ...req.query.slug].join('/'); // Removes base API path so the router can be mounted anywhere.
    return func(req, res);
  };
}
