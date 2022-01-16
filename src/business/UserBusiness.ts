import UserDatabase from "../data/UserDatabase"
import { Authenticator } from "../services/authenticator"
import { HashManager } from "../services/hashManager"
import IdGenerator from "../services/idGenerator"
import { User } from "../types/Users"
import { Post } from "../types/Posts"

export default class UserBusiness {
    async signup(name: string, email: string, password: string): Promise<string> {
        if (!name || !email || !password){
            throw new Error ("Preencha os campos 'name', 'email' e 'password'")
        }

        const userDB = new UserDatabase()
        const usedEmail = await userDB.searchUsers(email)

        if (usedEmail){
            throw new Error ('Email já cadastrado!')
        }

        const hashPassword = new HashManager().createHash(password)
        const id = new IdGenerator().generateId()

        const newUser = new User(id, name, hashPassword, email)
        await userDB.create(newUser)

        const token = new Authenticator().generateToken({id: id})

        return token
    }

    async login (email: string, password: string): Promise<string> {
        if (!email || !password){
            throw new Error ("Preencha os campos 'email' e 'senha'")
        }

        const userDB = new UserDatabase()
        const user = await userDB.getByEmail(email)

        if (!user){
            throw new Error ('Insira email e senha válidos!')
        }

        const passwordIsCorrect = new HashManager().compareHash(password, user.getPassword())

        if (!passwordIsCorrect){
            throw new Error ('Insira email e senha válidos!')
        }

        const token = new Authenticator().generateToken({id: user.getId()})

        return token
    }

    async doFriendship (token: string, guestId: string): Promise <void> {
        if (!token || !guestId){
            throw new Error ('Informe as IDs dos usuários.')
        }

        const tokenData = new Authenticator().getTokenData(token)
        if (!tokenData){
            throw new Error ('Token inválido.')
        }

        const userDB = new UserDatabase()
        const isFriendship = await userDB.checkFriendship(tokenData.id, guestId)

        if (isFriendship){
            throw new Error ('Amizade ja registrada!')
        }

        await userDB.doFriendship(tokenData.id, guestId)
    }

    async undoFriendship (token: string, guestId: string): Promise <void> {
        if (!token || !guestId){
            throw new Error ('Informe as IDs dos usuários.')
        }

        const tokenData = new Authenticator().getTokenData(token)
        if (!tokenData){
            throw new Error ('Token inválido.')
        }

        const userDB = new UserDatabase()
        const isFriendship = await userDB.checkFriendship(tokenData.id, guestId)

        if (!isFriendship){
            throw new Error ('Amizade não existente!')
        }

        await userDB.undoFriendship(tokenData.id, guestId)
    }

    async getFeed (token: string, page: number): Promise<Post []>{
        if (!token){
            throw new Error ('Envie o token de autenticação.')
        }

        const tokenData = new Authenticator().getTokenData(token)
        if (!tokenData){
            throw new Error ('Token inválido.')
        }

        const feed = await new UserDatabase().getFeed(tokenData.id, page)

        return feed
    }

}