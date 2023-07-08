/* eslint-disable semi */
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

// blogsRouter.get('/', (request, response) => {
//   Blog.find({})
//     .then(blogs => {
//       response.json(blogs)
//     })
// })

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const blogToAdd = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: user.id,
  });

  if (body.title === undefined || body.url === undefined) {
    response.status(400).end();
  } else {
    const blogToSave = await blogToAdd.save();
    user.blogs = user.blogs.concat(blogToSave._id);
    await user.save();
    response.status(201).json(blogToSave);
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const blogToDelete = await Blog.findById(request.params.id);
  if (blogToDelete.user.toString() === request.user.id) {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } else {
    return response
      .status(401)
      .json({ error: "Not authorized to delete the blog" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blogToUpdate = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
  };

  await Blog.findByIdAndUpdate(request.params.id, blogToUpdate, { new: true });
  response.json(blogToUpdate);
});

module.exports = blogsRouter;
