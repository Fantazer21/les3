import { Request, Response } from 'express';
import { ApiResponse, VideoResponse } from '../../types';
import { videoData } from '../../mocks/videos.mock';

export const getVideos = (_req: Request, res: Response<ApiResponse<VideoResponse>>) => {
  const response: ApiResponse<VideoResponse> = {
    status: 200,
    data: videoData,
  };

  res.json(response);
};
