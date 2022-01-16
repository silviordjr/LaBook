import { Request, Response } from "express";
import PostBusiness from "../business/PostBusiness";

export default class PostController {
    async create (req: Request, res: Response): Promise<void> {
        try {
            const {photo, description, type} = req.body
            const token = req.headers.authorization as string

            await new PostBusiness().create(photo, description, type, token)

            res.status(200).send('Post Criado!')
        } catch (error: any) {
            res.status(500).send(error.message || error.sqlmessage)
        }
    }

    async getById (req:Request, res: Response): Promise <void> {
        try {
            const id = req.params.id

            const post = await new PostBusiness().getById(id)

            res.status(200).send(post)
            
        } catch (error: any) {
            res.status(500).send(error.message || error.sqlmessage)
        }
    }

    async getByType (req: Request, res: Response): Promise <void> {
        try {
            const page = Number(req.query.page) || 1
            const type = req.params.type

            const feed = await new PostBusiness().getByType(type, page)

            res.status(200).send(feed)
        } catch (error: any) {
            res.status(500).send(error.message || error.sqlmessage)
        }
    }

    async like (req: Request, res: Response): Promise<void> {
        try {
            const token = req.headers.authorization as string
            const postId = req.body.postId

            await new PostBusiness().like(token, postId)

            res.status(200).send('Curtido!')
        } catch (error: any) {
            res.status(500).send(error.message || error.sqlmessage)
        }
    }
    
    async dislike (req: Request, res: Response): Promise <void> {
        try {
            const token = req.headers.authorization as string
            const postId = req.body.postId

            await new PostBusiness().dislike(token, postId)

            res.status(200).send('Descurtido!')
        } catch (error: any) {
            res.status(500).send(error.message || error.sqlmessage)
        }
    }

    async comment (req: Request, res: Response): Promise <void> {
        try {
            const token = req.headers.authorization as string
            const postId = req.body.postId
            const comment =  req.body.comment

            await new PostBusiness().comment(token, postId, comment)

            res.status(200).send('Comentado.')
        } catch (error: any) {
            res.status(500).send(error.message || error.sqlmessage)
        }
    }

    async deleteComment (req: Request, res: Response): Promise <void> {
        try {
            const token = req.headers.authorization as string
            const commentId = req.body.commentId
            
            await new PostBusiness().deleteComment(token, commentId)

            res.status(200).send("Comentário excluído!")
        } catch (error: any) {
            res.status(500).send(error.message || error.sqlmessage)
        }
    }
}