import { env } from './env';

const isDevelopment = env.NODE_ENV === 'development';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const logLevels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLogLevel = logLevels[env.LOG_LEVEL] || logLevels.info;

function log(level: LogLevel, message: string, data?: Record<string, any>) {
  if (logLevels[level] < currentLogLevel) {
    return;
  }

  const timestamp = new Date().toISOString();
  const logEntry = {
    level,
    message,
    data,
    timestamp,
  };

  if (isDevelopment) {
    const style = {
      debug: '\x1b[36m', // cyan
      info: '\x1b[32m', // green
      warn: '\x1b[33m', // yellow
      error: '\x1b[31m', // red
    }[level];

    console.log(`${style}[${level.toUpperCase()}]\x1b[0m ${message}`, data || '');
  } else {
    console.log(JSON.stringify(logEntry));
  }
}

export const logger = {
  debug: (message: string, data?: Record<string, any>) => log('debug', message, data),
  info: (message: string, data?: Record<string, any>) => log('info', message, data),
  warn: (message: string, data?: Record<string, any>) => log('warn', message, data),
  error: (message: string, data?: Record<string, any>) => log('error', message, data),
};
