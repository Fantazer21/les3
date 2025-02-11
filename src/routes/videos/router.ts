import { Router } from 'express';
import { getVideos } from './handlers';
import { ApiPaths } from '../paths';

export const videosRouter = Router();

videosRouter.get(ApiPaths.Videos, getVideos);
