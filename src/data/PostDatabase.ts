import FormatDate from "../services/FormatDate";
import { Post } from "../types/Posts";
import connection from "./connection";

export default class PostDatabase {
    async create (post: Post) {
        await connection ('labook_posts')
            .insert({
                id: post.getId(),
                date: post.getDate(),
                user_id: post.getUserId(),
                description: post.getDescription(),
                type: post.getType(),
                photo: post.getPhoto()
            })
    }

    async getById(id: string): Promise<Post> {
        const post = await connection ('labook_posts')
            .where({id})
            .select('*')

        const date = new FormatDate().format(post[0].date)
        const newPost = new Post(post[0].id, post[0].photo, post[0].description, date, post[0].type, post[0].user_id)

        return newPost
    }

    async getByType (type: string, page: number): Promise <Post []> {
        const posts = await connection ('labook_posts')
            .where({type})
            .select('*')
            .orderBy('date', "ASC")
            .limit(5)
            .offset((page - 1) * 5)
        
        const feed = []

        for (let post of posts){
            const date = new FormatDate().format(post.date)
            const newPost = new Post(post.id, post.photo, post.description, date, post.type, post.userId)

            feed.push(newPost)
        }

        return feed
    }

    async checkLike (userId: string, postId: string): Promise<boolean> {
        const likes = await connection ('labook_likes')
            .where({post_id: postId, user_id: userId})
            .select('*')
        
        if (likes.length === 0){
            return false
        } else{
            return true
        }
    }

    async like (userId: string, postId: string): Promise<void> {
        await connection ('labook_likes')
            .insert({
                post_id: postId,
                user_id: userId
            })
    }

    async dislike (userId: string, postId: string): Promise<void> {
        await connection ('labook_likes')
            .where({
                post_id: postId,
                user_id: userId
            })
            .del()
    }

    async comment (userId: string, postId: string, id: string, comment: string): Promise <void> {
        await connection ('labook_comments')
            .insert({
                id: id,
                comment: comment,
                user_id: userId,
                post_id: postId
            })
    }

    async getCommentOwner (commentId: string): Promise <string> {
        const owner = await connection ('labook_comments')
            .where({id: commentId})
            .select("user_id")
        
        return owner[0].user_id
    }

    async deleteComment (commentId: string): Promise <void> {
        await connection ('labook_comments')
            .where({id: commentId})
            .del()
    }
}