import { Request, Response } from 'express';
import { BlogViewModel, ApiResponse, ErrorResponse } from '../../types';
import { blogsData } from '../../mocks/blogs.mock';

const blogs: BlogViewModel[] = blogsData;

export const getBlogs = (_req: Request, res: Response) => {
  res.status(200).json(blogs);
};

// TODO: add tipization

export const getBlogById = (req: any, res: any) => {
  const blog = blogs.find(b => b.id === req.params.id);

  if (!blog) {
    return res.status(404).json({
      errorsMessages: [
        {
          message: 'Blog not found',
          field: 'id',
        },
      ],
    });
  }

  res.status(200).json(blog);
};

export const createBlog = (req: any, res: any) => {
  const { name, description, websiteUrl } = req.body;

  const urlPattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
  const errors = {
    errorsMessages: [] as { message: string; field: string }[],
  };

  if (!urlPattern.test(websiteUrl) || websiteUrl.length > 100) {
    errors.errorsMessages.push({
      message: 'Invalid url format or length',
      field: 'websiteUrl',
    });
  }

  if (!name || typeof name !== 'string' || name.length > 15) {
    errors.errorsMessages.push({
      message: 'Invalid name length',
      field: 'name',
    });
  }

  if (errors.errorsMessages.length) {
    return res.status(400).json(errors);
  }

  const newBlog = {
    description,
    id: (blogs.length + 1).toString(),
    name,
    websiteUrl,
  };

  blogs.push(newBlog);

  res.status(201).json({ ...newBlog });
};

export const updateBlog = (req: any, res: any) => {
  const { id } = req.params;
  const { name, description, websiteUrl } = req.body;

  const auth = req.headers.authorization;

  if (!auth) {
    return res.sendStatus(401);
  }

  if (auth !== 'Basic admin:qwerty') {
    return res.sendStatus(401);
  }

  const blogIndex = blogs.findIndex(b => b.id === id);

  if (blogIndex === -1) {
    return res.status(404).json({
      errorsMessages: [
        {
          message: 'Blog not found',
          field: 'id',
        },
      ],
    });
  }

  const updatedBlog: BlogViewModel = {
    ...blogs[blogIndex],
    name,
    description,
    websiteUrl,
  };

  blogs[blogIndex] = updatedBlog;

  const response: ApiResponse<BlogViewModel> = {
    status: 204,
    data: updatedBlog,
  };

  res.sendStatus(204).json(response);
};

export const deleteBlog = (req: any, res: any) => {
  const { id } = req.params;
  const blogIndex = blogs.findIndex(b => b.id === id);

  if (blogIndex === -1) {
    return res.status(404).json({
      status: 404,
      error: 'Blog not found',
    });
  }

  blogs.splice(blogIndex, 1);
  res.sendStatus(204);
};
