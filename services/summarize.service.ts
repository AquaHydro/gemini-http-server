import { PassThrough } from 'stream';
import model from '../model';

class SummarizeService {
  async summarizePage(text: string) {
    const prompt = `请为以下内容生成简短的概述,300字以内：${text}`;
    // 生成摘要
    const summary = await model.generateContent(prompt);
    const response = await summary.response;
    const res = response.text();
    return res;
  }

  async summarizePageStream(text: string, stream: PassThrough) {
    const prompt = `请为以下内容生成简短的概述, 300字以内：${text}`;

    const summaryGenerator = await model.generateContentStream(prompt);
    console.log('summaryGenerator', summaryGenerator);
    let res = '';
    for await (const chunk of summaryGenerator.stream) {
      // 将生成的块推送到流中
      res += chunk.text();
      stream.write(chunk.text());
    }

    // 结束流
    stream.end();

    return stream;
  }
}

export default new SummarizeService();
