import { NCApiHandler, NCApiRequest } from '../src/lib/routeTools';
import { performance } from 'perf_hooks';

/**
 * This is a perf logger middleware that relies on `next-connect` supporting async middleware.
 * Really just used for testing, but maybe an optional toggle in the future;
 */

export interface NCApiPerfRequest extends NCApiRequest {
  perf: {
    markStart: number;
    markLast: number;
    marks: [string, number][];
    getPerfMarkTime: (start?: number) => number;
    mark: (name: string) => void;
  };
}

export const perfLogger: NCApiHandler<NCApiPerfRequest> = async (req, res, next) => {
  req.perf = {
    markLast: undefined,
    markStart: performance.now(),
    marks: [],
    getPerfMarkTime: (start) => {
      return Math.round((req.perf.markLast - (start ?? req.perf.markStart)) * 100) / 100;
    },
    mark: (name) => {
      const { markLast } = req.perf;
      req.perf.markLast = performance.now();
      req.perf.marks.push([name, req.perf.getPerfMarkTime(markLast)]);
    },
  };

  console.log(`--> ${req.method?.toUpperCase()} - ${req.url}`);

  await next();

  if (req.perf.marks.length) {
    console.log('---', req.perf.marks.map(([markName, time]) => `${markName}: ${time}ms`).join(' | '));
  }

  console.log(`<-- ${req.method?.toUpperCase()} - ${req.url} ${res.statusCode} [${req.perf.getPerfMarkTime()}ms]`);
};
