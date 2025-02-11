import { Router } from 'express';

export const testingRouter = Router();

testingRouter.delete('/testing/all-data', (_req, res) => {
  const blogs = require('../../mocks/blogs.mock').blogsData;
  blogs.length = 0;
  res.sendStatus(204);
});
