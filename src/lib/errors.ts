export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class WikipediaApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'WikipediaApiError';
  }
}

export function handleApiError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof WikipediaApiError) {
    if (error.status === 429) {
      return new AppError(
        'Too many requests to Wikipedia. Please try again later.',
        ErrorCode.RATE_LIMIT,
        { status: error.status }
      );
    }
    return new AppError(
      'Wikipedia API error. Please try again later.',
      ErrorCode.API_ERROR,
      { status: error.status }
    );
  }

  return new AppError(
    'An unexpected error occurred.',
    ErrorCode.UNKNOWN_ERROR,
    { originalError: error instanceof Error ? error.message : String(error) }
  );
}

export function logError(error: unknown, context?: Record<string, any>) {
  const message = error instanceof Error ? error.message : String(error);
  const code = error instanceof AppError ? error.code : ErrorCode.UNKNOWN_ERROR;

  console.error('Error:', {
    message,
    code,
    context,
    timestamp: new Date().toISOString(),
  });
}
