module.exports = (app) => {
  const { existsOrError } = app.controllers.validation;

  const save = (req, res) => {
    const post = { ...req.body };

    if (req.params.id) post.postId = req.params.id;

    try {
      existsOrError(post.title, "Título não informado");
      existsOrError(post.content, "Post sem conteúdo.");
    } catch (msg) {
      res.status(400).send(msg);
    }

    if (post.id) {
      app
        .db("posts")
        .update(post)
        .where({ postId: post.postId })
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).json({ error: err }));
    } else {
      app
        .db("posts")
        .insert(post)
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).json({ error: err }));
    }
  };


  const getPosts = async (req, res) => {
    const limit = 5
    const page = req.query.page || 1
    const result = await app.db('posts').count('post_id').first()
    const count = parseInt(result.count)
    app
      .db("posts")
      .join("users", "users.user_id", "=", "posts.author")
      .select("users.nickname", "posts.post_id", "posts.title", "posts.content")
      .limit(limit).offset(page * limit - limit)
      .then(posts => res.json({ data: posts, count, limit}))
      .catch((err) => res.status(500).json({ error: err }));
  };


  const remove = (req, res) => {
    app
      .db("posts")
      .where({ post_id: req.params.id })
      .first()
      .delete()
      .then((_) => res.status(204).send())
      .catch((err) => res.status(504).send({ error: err }));
  };

  return { save, getPosts, remove };
};
