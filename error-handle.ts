import { Context } from "koa";

const errorTypes = require('./constants/error-types');

const errorHandler = (error: Error, ctx: Context) => {
  let status, message;

  switch (error.message) {
    case errorTypes.NAME_OR_PASSWORD_IS_REQUIRED:
      status = 400; // Bad Request
      message = '用户名或者密码不能为空~';
      break;
    default:
      status = 404;
      message = 'NOT FOUND';
  }

  ctx.status = status;
  ctx.body = message;
};

module.exports = errorHandler;
