const Koa = require('koa');
const cors = require('koa2-cors');
const Router = require('koa-router');
const errorHandler = require('./error-handle');

import type Context from 'koa';
import GeminiController from './controller/gemini.controller';

const app = new Koa();
const router = new Router();

app.on('error', errorHandler);
app.use(cors({
  origin: (ctx: Context) => {
    const allowedOrigins = ['https://www.ilikestudy.cn', 'https://blog.yiliang.me'];
    if (allowedOrigins.includes(ctx.request.header.origin || '')) {
      return ctx.request.header.origin;
    }
    return false; // Disallow other origins
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(router.routes());

// 文本生成
router.get('/plaintext', GeminiController.generateContent);

// web页面摘要生成
router.get('/summarize', GeminiController.summarizePage);

// web页面摘要生成（流）
router.get('/summarize/stream', GeminiController.summarizePageStream);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
