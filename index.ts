const Koa = require('koa');
const cors = require('koa2-cors');
const Router = require('koa-router');
const errorHandler = require('./error-handle');

import GeminiController from './controller/gemini.controller';

const app = new Koa();
const router = new Router();

app.on('error', errorHandler);
app.use(cors());
app.use(router.routes());

// 文本生成
router.get('/plaintext', GeminiController.generateContent);

// web页面摘要生成
router.get('/summarize', GeminiController.summarizePage);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
