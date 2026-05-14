import { createLogger, transports, format } from 'winston';
import * as appInsights from 'applicationinsights';
import { envs } from './envs';

appInsights
  .setup(envs.APPINSIGHTS_CONNECTION_STRING)
  .setAutoCollectConsole(false)
  .setSendLiveMetrics(true)
  .start();

const aiClient = appInsights.defaultClient;

const appInsightsTransport = new transports.Console({
  level: 'info',
  format: format.printf(({ level, message, timestamp }) => {
    aiClient.trackTrace({
      message: `[${level}] ${message}`,
      properties: { timestamp },
    });
    return `${timestamp} [${level}] ${message}`;
  }),
});

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
  transports: [new transports.Console(), appInsightsTransport],
});
