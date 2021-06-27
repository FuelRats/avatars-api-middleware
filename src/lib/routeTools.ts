import { NextApiRequest, NextApiResponse } from 'next';
import { RequestHandler } from 'next-connect';

export interface NCApiRequest extends NextApiRequest {
  params: Record<string, string | string[]>;
}

export type NCApiHandler<Req = NCApiRequest, Res = NextApiResponse> = RequestHandler<Req, Res>;

export const resolveQueryParam = (param: string | string[]): string => (
  Array.isArray(param)
    ? param.pop()
    : param
);

export const nextParamAdapter: NCApiHandler = (req, _, next) => {
  if (req.params) {
    req.query = {
      ...req.params,
      ...(req.query ?? {}),
    };
  }

  return next();
};



