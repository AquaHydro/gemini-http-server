import model from '../model';

class ContentService {
  async generateContent(prompt: string) {
    // 获取网页内容

    const result = await model.generateContent(prompt);
    const response = await result.response;

    const res = response.text();
    return res;
  }
}

export default new ContentService();
