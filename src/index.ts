import * as express from 'express';
import { Express } from 'express';
import { blogsRouter } from './routes/blogs/router';
import { videosRouter } from './routes/videos/router';

const app: Express = express.default();
const port: number = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/', blogsRouter);
app.use('/', videosRouter);

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
