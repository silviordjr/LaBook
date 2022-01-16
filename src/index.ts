import app from "./app";
import PostController from "./controller/PostController";
import UserController from "./controller/UserController";

const userController = new UserController()
const postController =  new PostController()

app.post('/signup', userController.signup)
app.post('/login', userController.login)
app.post('/posts', postController.create)
app.post('/friendship', userController.doFriendship)
app.post('/posts/like', postController.like)
app.post('/posts/comment', postController.comment)

app.get('/posts/:id', postController.getById)
app.get('/feed', userController.getFeed)
app.get('/feed/:type', postController.getByType)

app.delete('/friendship', userController.undoFriendship)
app.delete('/posts/like', postController.dislike)
app.delete('/posts/comment', postController.deleteComment)