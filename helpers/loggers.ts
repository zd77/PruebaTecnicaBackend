import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import dayjs from 'dayjs';
import { join } from 'path';

const timeZone = () =>
  new Date().toLocaleDateString('en-Es', {
    timeZone: 'America/Tegucigalpa',
    minute: '2-digit',
    hour: '2-digit',
  });

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: timeZone }),
  winston.format.prettyPrint()
);

const transportOptions = {
  filename: '%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '90d',
  maxSize: '6m',
};

const infoTransportLogger: DailyRotateFile = new DailyRotateFile({
  ...transportOptions,
  dirname: join(__dirname, `../logs/info/${dayjs().format('MM-YYYY')}`),
});

const errorTransportLogger: DailyRotateFile = new DailyRotateFile({
  ...transportOptions,
  dirname: join(__dirname, `../logs/error/${dayjs().format('MM-YYYY')}`),
});

export const errorLog = winston.createLogger({
  level: 'error',
  format: logFormat,
  transports: [errorTransportLogger],
});

export const infoLog = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [infoTransportLogger],
});
