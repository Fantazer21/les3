import { Request, Response } from 'express';
import { PostViewModel, ApiResponse, ErrorResponse } from '../../types';
import { postsData } from '../../mocks/posts.mock';
import { blogsData } from '../../mocks/blogs.mock';
import { collections } from '../../db/connectionDB';

const posts: PostViewModel[] = postsData;

export const getPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await collections.posts?.find({}, { projection: { _id: 0 } }).toArray();

    res.status(200).json(posts);
  } catch (error) {
    console.error('❌ Ошибка при получении постов:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getPostById = async (req: any, res: any) => {
  try {
    const post = await collections.posts?.findOne(
      { id: req.params.id },
      { projection: { _id: 0 } },
    );

    if (!post) {
      return res.status(404).json({
        errorsMessages: [
          {
            message: 'Post not found',
            field: 'id',
          },
        ],
      });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error('❌ Ошибка при получении поста:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createPost = (req: any, res: any) => {
  const { title, shortDescription, content, blogId } = req.body;

  const checkToken = `Basic ${btoa('admin:qwerty')}`;

  if (!req.headers || !req.headers.authorization || req.headers.authorization !== checkToken) {
    return res.sendStatus(401);
  }

  const errors = {
    errorsMessages: [] as { message: string; field: string }[],
  };

  if (!title || title.trim() === '' || typeof title !== 'string' || title.trim().length > 30) {
    errors.errorsMessages.push({
      message: 'Invalid title length',
      field: 'title',
    });
  }

  if (!shortDescription || shortDescription.trim() === '' || shortDescription.length > 100) {
    errors.errorsMessages.push({
      message: 'Invalid short description length',
      field: 'shortDescription',
    });
  }

  if (!content || content.trim() === '' || content.length > 1000) {
    errors.errorsMessages.push({
      message: 'Invalid content length',
      field: 'content',
    });
  }

  const blog = blogsData.find(b => b.id === blogId);
  if (!blog) {
    errors.errorsMessages.push({
      message: 'Blog not found',
      field: 'blogId',
    });
  }

  if (errors.errorsMessages.length) {
    return res.status(400).json(errors);
  }

  const newPost: PostViewModel = {
    id: (posts.length + 1).toString(),
    title,
    shortDescription,
    content,
    blogId,
    blogName: blog?.name || 'Unknown Blog',
    createdAt: new Date().toISOString(),
  };

  posts.push(newPost);

  res.status(201).json(newPost);
};

export const updatePost = (req: any, res: any) => {
  const { id } = req.params;
  const { title, shortDescription, content, blogId } = req.body;

  const checkToken = `Basic ${btoa('admin:qwerty')}`;

  if (!req.headers || !req.headers.authorization || req.headers.authorization !== checkToken) {
    return res.sendStatus(401);
  }

  const errors = {
    errorsMessages: [] as { message: string; field: string }[],
  };

  if (!title || title.trim() === '' || typeof title !== 'string' || title.trim().length > 30) {
    errors.errorsMessages.push({
      message: 'Invalid title length',
      field: 'title',
    });
  }

  if (!shortDescription || shortDescription.trim() === '' || shortDescription.length > 100) {
    errors.errorsMessages.push({
      message: 'Invalid short description length',
      field: 'shortDescription',
    });
  }

  if (!content || content.trim() === '' || content.length > 1000) {
    errors.errorsMessages.push({
      message: 'Invalid content length',
      field: 'content',
    });
  }

  const blog = blogsData.find(b => b.id === blogId);
  if (!blog) {
    errors.errorsMessages.push({
      message: 'Blog not found',
      field: 'blogId',
    });
  }

  if (errors.errorsMessages.length) {
    return res.status(400).json(errors);
  }

  const postIndex = posts.findIndex(p => p.id === id);

  if (postIndex === -1) {
    return res.status(404).json({
      errorsMessages: [
        {
          message: 'Post not found',
          field: 'id',
        },
      ],
    });
  }

  const updatedPost = {
    ...posts[postIndex],
    title,
    shortDescription,
    content,
    blogId,
    blogName: blog?.name || 'Unknown Blog',
  };

  posts[postIndex] = updatedPost;
  return res.sendStatus(204);
};

export const deletePost = (req: any, res: any) => {
  const { id } = req.params;

  const checkToken = `Basic ${btoa('admin:qwerty')}`;

  if (!req.headers || !req.headers.authorization || req.headers.authorization !== checkToken) {
    return res.sendStatus(401);
  }

  const postIndex = posts.findIndex(p => p.id === id);

  if (postIndex === -1) {
    return res.status(404).json({
      errorsMessages: [
        {
          message: 'Post not found',
          field: 'id',
        },
      ],
    });
  }

  posts.splice(postIndex, 1);
  res.sendStatus(204);
};
