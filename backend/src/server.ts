import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const startServer = () => {
  try {
    const port = parseInt(env.PORT, 10);
    
    const server = app.listen(port, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${port}`);

      // Self-ping to prevent Render.com free tier from sleeping (every 10 min)
      if (env.NODE_ENV === 'production') {
        const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes
        setInterval(async () => {
          try {
            const url = `https://${process.env.RENDER_EXTERNAL_HOSTNAME || 'localhost'}:${port}/api/health`;
            const res = await fetch(url);
            logger.info(`Self-ping: ${res.status}`);
          } catch (err) {
            logger.warn('Self-ping failed, will retry next interval');
          }
        }, PING_INTERVAL);
        logger.info('Self-ping enabled (every 10 min)');
      }
    });

    // Graceful shutdown
    const shutdown = () => {
      logger.info('Shutting down gracefully...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
      
      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
