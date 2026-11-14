import { handleApiRequest, type WorkerEnv } from '../../worker';

interface CFContext {
  request: Request;
  env: WorkerEnv;
}

export async function onRequest(context: CFContext): Promise<Response> {
  return handleApiRequest(context.request, context.env);
}
