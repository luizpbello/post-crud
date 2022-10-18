const bcrypt = require("bcrypt-nodejs");

module.exports = (app) => {
 
  const { existOrError, equalsOrError, notExistsOrError } =
    app.controllers.validation;

  const encryptPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const save = async (req, res) => {
    const user = { ...req.body };

    if (req.params.id) user.user_id = req.params.id;

    try {
      existOrError(user.username, "Username não informado.");
      existOrError(user.nickname, "Nickname não informado.");
      existOrError(user.email, "Email não informado.");
      existOrError(user.password, "Senha não informado.");
      existOrError(user.confirmPassword, "Confirmação de senha não informado.");
      equalsOrError(
        user.password,
        user.confirmPassword,
        "As senhas digitadas não são iguais."
      );

      const userFromDB = await app
        .db("users")
        .where({ username: user.username })
        .first();
      if (!user.id) {
        notExistsOrError(userFromDB, "Usuário ja cadastrado.");
      }
    } catch (msg) {
      return res.status(400).send(msg);
    }

    user.password = encryptPassword(user.password);
    delete user.confirmPassword;

    if (user.user_id) {
      app
        .db("users")
        .update(user)
        .where({ user_id: user.user_id })
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).json({ erro: err }));
    } else {
      app
        .db("users")
        .insert(user)
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).json({ error: err }));
    }
  };

  const getUsers = async (req, res) => {
    app
      .db("users")
      .then((users) => res.json(users))
      .catch((err) => res.status(500).send({ error: err }));
  };

  const getUserById = (req, res) => {
    app
      .db("users")
      .where({ user_id: req.params.id })
      .first()
      .then((user) => res.json(user))
      .catch((err) => res.status(500).send({ error: err }));
  };

  const remove = (req, res) => {
    app
      .db("users")
      .where({ user_id: req.params.id })
      .first()
      .delete()
      .then((_) => res.status(200).send())
      .catch((err) => res.status(500).send({ error: err }));
  };

  return { save, getUsers, getUserById, remove };
};
