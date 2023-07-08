/* eslint-disable semi */
const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Give password as an argument");
  process.exit(1);
}

const userPassword = process.argv[2];

const url = `mongodb+srv://abhay2412:${userPassword}@cluster1.441lb.mongodb.net/FullStackOpen2023Part4TestDatabase?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

if (process.argv.length === 6) {
  Blog.find({}).then((result) => {
    console.log("Blog: ");
    result.forEach((blog) => {
      console.log(`${blog.title} ${blog.author} ${blog.url} ${blog.likes}`);
    });
    mongoose.connection.close();
  });
} else {
  const blog = new Blog({
    title: process.argv[3],
    author: process.argv[4],
    url: process.argv[5],
    likes: process.argv[6],
  });
  blog.save().then((result) => {
    console.log(
      `Added the blog title ${result.title} and with the author ${result.author} and link to the url ${result.url} and with this many likes ${result.likes} to the blogs`
    );
    mongoose.connection.close();
  });
}
