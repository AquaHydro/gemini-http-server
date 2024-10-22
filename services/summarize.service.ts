import { PassThrough } from 'stream';
import model from '../model';

class SummarizeService {
  static prompt = '请使用简体中文为以下内容生成简短的概述,不要使用markdown格式,有富文本请使用html格式进行输出,300字以内：';
  async summarizePage(text: string) {
    const prompt = `${SummarizeService.prompt}${text}`;
    // 生成摘要
    const summary = await model.generateContent(prompt);
    const response = await summary.response;
    const res = response.text();
    return res;
  }

  async summarizePageStream(text: string, stream: PassThrough) {
    const prompt = `${SummarizeService.prompt}${text}`;

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
