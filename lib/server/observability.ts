import 'server-only';

export function reportServerError(context: string, error: unknown) {
  const errorId = crypto.randomUUID();
  console.error(
    JSON.stringify({
      level: 'error',
      errorId,
      context,
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }),
  );
  return errorId;
}

export function hasValidOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return Boolean(origin && origin === new URL(request.url).origin);
}
