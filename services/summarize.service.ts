import model from "../model";


class SummarizeService {
  async summarizePage(text: string) {
    // 获取网页内容
    

    const prompt = `请为以下内容生成简短的概述,300字以内：${text}`;
    // 生成摘要
    const summary = await model.generateContent(prompt);
    const response = await summary.response;
    const res = response.text();
    return res;
  }
}

export default new SummarizeService();