import Koa from 'koa';
import axios from 'axios';
import { PassThrough } from 'stream';
import TurndownService from 'turndown';
import * as cheerio from 'cheerio';
import errorTypes from '../constants/error-types';
import summarizeService from '../services/summarize.service';
import contentService from '../services/content.service';

class GeminiController {
  private turndownService: TurndownService;

  constructor() {
    this.turndownService = new TurndownService();
  }

  summarizePage = async (ctx: Koa.Context, next: Koa.Next) => {
    const url = ctx.query.url;

    if (!url || typeof url !== 'string') {
      const error = new Error(errorTypes.URL_IS_REQUIRED);
      return ctx.app.emit('error', error, ctx);
    }

    const html = await axios
      .get(url)
      .then((response: { data: string }) => response.data)
      .catch(() => {
        const error = new Error(errorTypes.HTTP_ERROR);
        return ctx.app.emit('error', error, ctx);
      });

    if (typeof html !== 'string') {
      const error = new Error('Invalid HTML content');
      return ctx.app.emit('error', error, ctx);
    }
    
    try {
      const $ = cheerio.load(html);
      const sections = $('section');
      
      if (sections.length < 2) {
        const error = new Error('Not enough sections found');
        return ctx.app.emit('error', error, ctx);
      }
  
      const secondSectionHtml = sections.eq(1).html() || '';
      const markdown = this.turndownService.turndown(secondSectionHtml);
      ctx.body = await summarizeService.summarizePage(markdown); // 使用markdown而不是html
    } catch (error) {
      ctx.body = 'Error converting HTML to Markdown';
    }
  }

  summarizePageStream = async (ctx: Koa.Context, next: Koa.Next) => {
    const url = ctx.query.url;

    if (!url || typeof url !== 'string') {
      const error = new Error(errorTypes.URL_IS_REQUIRED);
      return ctx.app.emit('error', error, ctx);
    }

    const html = await axios
      .get(url)
      .then((response: { data: string }) => response.data)
      .catch(() => {
        const error = new Error(errorTypes.HTTP_ERROR);
        return ctx.app.emit('error', error, ctx);
      });

    if (typeof html !== 'string') {
      const error = new Error('Invalid HTML content');
      return ctx.app.emit('error', error, ctx);
    }

    const $ = cheerio.load(html);
    const sections = $('section');
    if (sections.length < 2) {
      const error = new Error('Not enough sections found');
      return ctx.app.emit('error', error, ctx);
    }

    const secondSectionHtml = sections.eq(1).html() || '';
    const markdown = this.turndownService.turndown(secondSectionHtml);
    const summaryStream = new PassThrough();

    ctx.set({
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream',
    });
    ctx.body = summaryStream;
    ctx.status = 200;
    summarizeService.summarizePageStream(markdown, summaryStream);
  }

  generateContent = async (ctx: Koa.Context, next: Koa.Next) => {
    const prompt = ctx.query.prompt;

    if (!prompt || typeof prompt !== 'string') {
      const error = new Error(errorTypes.PROMPT_IS_REQUIRED);
      return ctx.app.emit('error', error, ctx);
    }

    ctx.body = await contentService.generateContent(prompt);
  }
}

export default new GeminiController();
