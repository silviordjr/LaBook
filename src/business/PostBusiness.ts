import PostDatabase from "../data/PostDatabase"
import { Authenticator } from "../services/authenticator"
import FormatDate from "../services/FormatDate"
import IdGenerator from "../services/idGenerator"
import { Post, POST_TYPES } from "../types/Posts"

export default class PostBusiness {
    async create (photo: string, desciption: string, type: string, token: string): Promise<void> {
            if (!photo || !desciption || !type || !token){
                throw new Error ("Verifique os campos 'photo', 'desciption' e 'type' e verifique o token enviado.")
            }

            let postType: POST_TYPES
            if (type === 'EVENT'){
                postType = POST_TYPES.EVENT
            } else {
                postType = POST_TYPES.NORMAL
            }

            const tokenData = new Authenticator().getTokenData(token)
            if (!tokenData){
                throw new Error ('Token Inválido.')
            }

            const userId = tokenData.id
            const date = new FormatDate().create()
            const id = new IdGenerator().generateId()

            const newPost = new Post(id, photo, desciption, date, postType, userId)

            const postDB = new PostDatabase()
            await postDB.create(newPost)
    
    }

    async getById (id: string): Promise<Post> {
        if (!id){
            throw new Error ('ID não informada!')
        }

        const postDB = new PostDatabase()
        const post = postDB.getById(id)

        return post
    }

    async getByType (type: string, page: number): Promise<Post []> {
        if (!type){
            throw new Error ('Passe o type desejado.')
        }

        const feed = await new PostDatabase().getByType(type, page)

        return feed
    }

    async like (token: string, postId: string): Promise <void> {
        if (!token || !postId){
            throw new Error ("Passe o token de autenticação e a id do post.")
        }

        const tokenData = new Authenticator().getTokenData(token)
        if (!tokenData){
            throw new Error ('Token inválido.')
        }

        const postDB = new PostDatabase()
        const isLiked = await postDB.checkLike(tokenData.id, postId)

        if (isLiked){
            throw new Error ('Publicação ja curtida')
        }

        await postDB.like(tokenData.id, postId)
    }

    async dislike (token: string, postId: string): Promise <void> {
        if (!token || !postId){
            throw new Error ("Passe o token de autenticação e a id do post.")
        }

        const tokenData = new Authenticator().getTokenData(token)
        if (!tokenData){
            throw new Error ('Token inválido.')
        }

        const postDB = new PostDatabase()
        const isLiked = await postDB.checkLike(tokenData.id, postId)

        if (!isLiked){
            throw new Error ('Publicação não curtida')
        }

        await postDB.dislike(tokenData.id, postId)
    }

    async comment (token: string, postId: string, comment: string): Promise <void> {
        if (!token || !postId || !comment){
            throw new Error ("Passe o token de autenticação e a id do post, além do comentário.")
        }

        const tokenData = new Authenticator().getTokenData(token)
        if (!tokenData){
            throw new Error ('Token inválido.')
        }

        const id = new IdGenerator().generateId()

        const postDB = new PostDatabase()
        await postDB.comment(tokenData.id, postId, id, comment)
    }

    async deleteComment (token: string, commentId: string): Promise <void> {
        if (!token || !commentId){
            throw new Error ('Informe o comntário a ser excluído e passe o token de autorização.')
        }

        const tokenData = new Authenticator().getTokenData(token)
        if (!tokenData){
            throw new Error ('Token inválido.')
        }

        const postDB = new PostDatabase()
        const ownerId = await postDB.getCommentOwner(commentId)
        
        if(tokenData.id !== ownerId){
            throw new Error ('Você não tem autorização para excluir esse comentário')
        }

        await postDB.deleteComment(commentId)
    }
}