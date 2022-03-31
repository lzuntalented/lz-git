import { Request, Response, NextFunction } from 'express';

export function header(req: Request, res: Response, next: NextFunction) {
  if (
    req.header('Content-Type'.toLowerCase()) ===
      'application/x-git-upload-pack-request' ||
    req.header('Content-Type'.toLowerCase()) ===
      'application/x-git-receive-pack-request'
  ) {
    const body = [];
    req
      .on('data', (chunk) => {
        body.push(chunk);
      })
      .on('end', () => {
        // body转换成buffer格式利于将body内容作为输入传入git命令中
        req.body = Buffer.concat(body);
        next();
      });
  } else {
    next();
  }
}
