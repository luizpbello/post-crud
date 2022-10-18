module.exports = (app) => {
  app.route("/users")
    .get(app.controllers.User_Controller.getUsers)
    .post(app.controllers.User_Controller.save)


  app.route('/users/:id')
  .put(app.controllers.User_Controller.save)
  .get(app.controllers.User_Controller.getUserById)
  .delete(app.controllers.User_Controller.remove)
    

  app.route('/posts')
  .get(app.controllers.Posts_Controller.getPosts)
  .post(app.controllers.Posts_Controller.save)

  app.route('/posts/:id')
    .put(app.controllers.Posts_Controller.save)

};
