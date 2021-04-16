import { createLogger } from 'bunyan';
import { v4 as uuid } from 'uuid';
import { resolve } from 'path';
import * as signale from 'signale';
import axios from 'axios';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GiveawayNotFoundException } from './giveaway/exception/giveaway-not-found.exception';

const logger = createLogger({
  name: 'logger',
  streams: [{ path: resolve(__dirname, '../error.log') }],
});

interface ErrorResponse {
  id: string;
  statusCode: number;
  message: string;
}

const AVOID_DISCORD_LOG = [GiveawayNotFoundException];

@Catch(HttpException, Error)
export class ErrorHandler implements ExceptionFilter {
  async catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const errorResponse = this.getErrorResponse(exception);

    this.logInFile(exception);
    this.logInConsole(exception);
    this.logInDiscord(exception, request);

    response.status(errorResponse.statusCode).send(errorResponse);
  }

  getErrorResponse(exception: HttpException | Error): ErrorResponse {
    const id = uuid();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      return {
        id,
        statusCode: status,
        message:
          typeof response === 'string' ? response : (response as any).message,
      };
    }

    return {
      id,
      statusCode: 500,
      message: 'Internal Server Error',
    };
  }

  logInConsole(exception: HttpException | Error) {
    signale.error(exception);
  }

  logInFile(exception: HttpException | Error) {
    logger.error(exception);
  }

  async logInDiscord(exception: HttpException | Error, request: Request) {
    const avoidLog = AVOID_DISCORD_LOG.some(
      (instance) => exception instanceof instance,
    );

    if (avoidLog) return;

    try {
      const response = this.getErrorResponse(exception);
      let emoji: string;

      switch (response.statusCode) {
        case 403:
        case 401:
        case 400:
        case 404:
          emoji = '🤨';
          break;
        default:
          emoji = '😰';
          break;
      }

      const embed = {
        title: `${emoji} ${response.statusCode} | ${response.message}`,
        description: `
        **ID**: ${response.id}
        **Route**: ${request.method} ${request.url}
        `,
      };

      await axios.post(process.env.DISCORD_SYSTEM_LOGS_WEBHOOK, {
        embeds: [embed],
      });
    } catch (error) {
      signale.error("Can't send error to discord, check webhook");
      signale.error(error);

      if (error.response) {
        console.error(error.response.data);
      }
    }
  }
}
