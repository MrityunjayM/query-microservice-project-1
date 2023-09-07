import express from "express";
import cors from "cors";

const app = express();

// initialize middleware('s)
app.use(express.json());
app.use(cors());

// datastore
const posts = {};

// define GET route for /posts - retrive all posts
app.get("/posts", (req, res) => {
  return res.json(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "PostCreated") {
    posts[data.id] = { ...data, comments: [] };
  }

  if (type === "CommentCreated") {
    const comments = posts[data.postId].comments;
    comments.push({
      id: data.id,
      status: data.status,
      comment: data.comment,
    });
  }

  if (type === "CommentUpdated") {
    // find comment from the comments array of the post with the postId of the comment
    const comments = posts[data.postId].comments;
    const comment = comments.find(({ id }) => id === data.id);

    // update comment attributes
    comment.id = data.id;
    comment.status = data.status;
    comment.comment = data.comment;
  }

  return res.sendStatus(204);
});

const PORT = process.env.PORT || 4013;

app.listen(PORT, () => {
  console.info("[QUERY SERVICE]: running on port %d", PORT);
});
