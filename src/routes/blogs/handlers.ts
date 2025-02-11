import { Request, Response } from 'express';
import { BlogViewModel, ApiResponse, BlogsResponse, BlogInputModel } from '../../types';
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
      status: 404,
      error: 'Blog not found',
    });
  }

  const response: ApiResponse<BlogViewModel> = {
    status: 200,
    data: blog,
  };

  res.json(response);
};

export const createBlog = (req: Request<{}, {}, BlogInputModel>, res: Response) => {
  const { name, description, websiteUrl } = req.body;

  const newBlog = {
    description,
    id: (blogs.length + 1).toString(),
    name,
    websiteUrl,
  };

  blogs.push(newBlog);

  res.status(201).json(newBlog);
};

export const updateBlog = (req: any, res: any) => {
  const { id } = req.params;
  const { name, description, websiteUrl } = req.body;

  const blogIndex = blogs.findIndex(b => b.id === id);

  if (blogIndex === -1) {
    return res.status(404).json({
      status: 404,
      error: 'Blog not found',
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
    status: 200,
    data: updatedBlog,
  };

  res.json(response);
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
