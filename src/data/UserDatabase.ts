import { Post } from "../types/Posts"
import { User } from "../types/Users"
import connection from "./connection"
import FormatDate from "../services/FormatDate";

export default class UserDatabase {
    async searchUsers (email: string): Promise<boolean> {
        
        const users = await connection ('labook_users')
            .where({email: email})
            .select('*')
        
        if (users.length > 0){
            return true
        } else {
            return false
        }
    }

    async create (user: User): Promise <void>{

        await connection ('labook_users')
            .insert({
                id: user.getId(),
                email: user.getEmail(),
                name: user.getName(),
                password: user.getPassword()
            })
    }

    async getByEmail (email: string): Promise<User | undefined> {
        const user = await connection ('labook_users')
            .where({email})
            .select('*')
        
        const newUser = new User(user[0].id, user[0].name, user[0].password, user[0].email)

        return newUser
    }

    async checkFriendship (firstUserId: string, secondUserId: string): Promise<boolean> {
        const friendship = await connection ('labook_friendship')
            .where({first_user_id: firstUserId, second_user_id: secondUserId})
            .select('*')

        const inverseFriendship = await connection ('labook_friendship')
            .where({first_user_id: secondUserId, second_user_id: firstUserId})
            .select('*')

        if(friendship.length === 0 && inverseFriendship.length === 0){
            return false
        } else {
            return true
        }
    }

    async doFriendship (firstUserId: string, secondUserId: string): Promise<void> {
        await connection ('labook_friendship')
            .insert({
                first_user_id: firstUserId,
                second_user_id: secondUserId
            })
    }

    async undoFriendship (firstUserId: string, secondUserId: string): Promise<void> {
        await connection ('labook_friendship')
            .where({first_user_id: firstUserId, second_user_id: secondUserId})
            .orWhere({first_user_id: secondUserId, second_user_id: firstUserId})
            .del()
    }

    async getFeed (id: string, page: number): Promise<Post []> {
        const posts1 = await connection ('labook_friendship')
            .where({first_user_id: id})
            .join('labook_posts', 'labook_posts.user_id', '=', 'labook_friendship.second_user_id')
            .select('labook_posts.id as id', 'labook_posts.photo as photo', 'labook_posts.description as description', 'labook_posts.date as date', 'labook_posts.type as type', 'labook_posts.user_id as userId')
            .orderBy('labook_posts.date', "ASC")
            .limit(5)
            .offset((page - 1) * 5)
        
        const posts2 = await connection ('labook_friendship')
            .where({second_user_id: id})
            .join('labook_posts', 'labook_posts.user_id', '=', 'labook_friendship.first_user_id')
            .select('labook_posts.id as id', 'labook_posts.photo as photo', 'labook_posts.description as description', 'labook_posts.date as date', 'labook_posts.type as type', 'labook_posts.user_id as userId')
            .orderBy('labook_posts.date', "ASC")
            .limit(5)
            .offset((page - 1) * 5)

        const feed = []

        for (let post of posts1){

            const date = new FormatDate().format(post.date)
            const newPost = new Post(post.id, post.photo, post.description, date, post.type, post.userId)

            feed.push(newPost)
        }

        for (let post of posts2){

            const date = new FormatDate().format(post.date)
            const newPost = new Post(post.id, post.photo, post.description, date, post.type, post.userId)

            feed.push(newPost)
        }

        return feed
    }

}