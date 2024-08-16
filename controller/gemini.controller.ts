import Koa from 'koa';
import axios from 'axios';
import { PassThrough } from 'stream';
import errorTypes from '../constants/error-types';
import summarizeService from '../services/summarize.service';
import contentService from '../services/content.service';

class GeminiController {
  async summarizePage(ctx: Koa.Context, next: Koa.Next) {
    const url = ctx.query.url;

    if (!url || typeof url !== 'string') {
      const error = new Error(errorTypes.URL_IS_REQUIRED);
      return ctx.app.emit('error', error, ctx);
    }

    const html =
      (await axios
        .get(url)
        .then((response: { data: string }) => response.data)
        .catch(() => {
          const error = new Error(errorTypes.HTTP_ERROR);
          return ctx.app.emit('error', error, ctx);
        })) + '';
    const text = html.replace(/<[^>]*>/g, '');

    ctx.body = await summarizeService.summarizePage(text);
  }

  async summarizePageStream(ctx: Koa.Context, next: Koa.Next) {
    const url = ctx.query.url;

    if (!url || typeof url !== 'string') {
      const error = new Error(errorTypes.URL_IS_REQUIRED);
      return ctx.app.emit('error', error, ctx);
    }

    const html =
      (await axios
        .get(url)
        .then((response: { data: string }) => response.data)
        .catch(() => {
          const error = new Error(errorTypes.HTTP_ERROR);
          return ctx.app.emit('error', error, ctx);
        })) + '';

    const text = html.replace(/<[^>]*>/g, '');
    const summaryStream = new PassThrough();

    ctx.set({
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream',
    });
    ctx.body = summaryStream;
    summarizeService.summarizePageStream(text, summaryStream);
  }

  async generateContent(ctx: Koa.Context, next: Koa.Next) {
    const prompt = ctx.query.prompt;

    if (!prompt || typeof prompt !== 'string') {
      const error = new Error(errorTypes.PROMPT_IS_REQUIRED);
      return ctx.app.emit('error', error, ctx);
    }

    ctx.body = await contentService.generateContent(prompt);
  }
}

export default new GeminiController();
