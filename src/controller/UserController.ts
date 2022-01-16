import { Request, Response } from "express";
import UserBusiness from "../business/UserBusiness";

export default class UserController {
    async signup (req: Request, res: Response): Promise<void> {
        try {
            const {name, email, password} = req.body

            const token = await new UserBusiness().signup(name, email, password)

            res.status(200).send({message: 'Usuário criado!', token: token})
        } catch (error: any) {
            res.status(500).send(error.message || error.sqlmessage)
        }
    }

    async login (req: Request, res: Response): Promise<void> {
        try {
            const {email, password} = req.body

            const token = await new UserBusiness().login(email, password)

            res.status(200).send({token: token})
            
        } catch (error: any) {
            res.status(500).send(error.message || error.sqlmessage)
        }
    }

    async doFriendship (req: Request, res: Response): Promise <void> {
        try {
            const token = req.headers.authorization as string
            const guestId = req.body.guestId
            
            await new UserBusiness().doFriendship(token, guestId)

            res.status(200).send('Amizade Criada!')
        } catch (error: any) {
            res.status(500).send(error.message || error.sqlmessage)
        }
    }

    async undoFriendship (req: Request, res: Response): Promise <void> {
        try {
            const token = req.headers.authorization as string
            const guestId = req.body.guestId

            await new UserBusiness().undoFriendship(token, guestId)

            res.status(200).send('Amizade encerrada.')
        } catch (error: any) {
            res.status(500).send(error.message || error.sqlmessage)
        }
    }

    async getFeed (req: Request, res: Response): Promise<void> {
        try {
            const token = req.headers.authorization as string
            const page = Number(req.query.page) || 1

            const feed = await new UserBusiness().getFeed(token, page)

            res.status(200).send(feed)
        } catch (error: any) {
            res.status(500).send(error.message || error.sqlmessage)
        }
    }

}