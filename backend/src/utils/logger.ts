export const logger = {
  info: (message: string, meta?: any) => log('info', message, meta),
  warn: (message: string, meta?: any) => log('warn', message, meta),
  error: (message: string, meta?: any) => log('error', message, meta),
  debug: (message: string, meta?: any) => log('debug', message, meta),
};

function log(level: string, message: string, meta?: any) {
  const timestamp = new Date().toISOString();
  // Filter out sensitive data from meta if present
  let safeMeta = meta;
  if (meta && typeof meta === 'object') {
    safeMeta = { ...meta };
    delete safeMeta.password;
    delete safeMeta.token;
    delete safeMeta.accessToken;
    delete safeMeta.refreshToken;
  }
  
  const logEntry = {
    timestamp,
    level,
    message,
    ...(safeMeta && { meta: safeMeta }),
  };
  
  const logStr = JSON.stringify(logEntry);
  
  switch (level) {
    case 'error':
      console.error(logStr);
      break;
    case 'warn':
      console.warn(logStr);
      break;
    case 'debug':
      console.debug(logStr);
      break;
    default:
      console.info(logStr);
  }
}
