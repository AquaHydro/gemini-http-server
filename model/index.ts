const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.Gemini_Key);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export default model;