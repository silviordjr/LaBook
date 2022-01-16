export type authenticationData = {
  id: string
}

export class User {
    constructor(
        protected id: string,
        protected name: string,
        protected password: string,
        protected email: string
    ){}

    getId (){
        return this.id
    }

    getName (){
        return this.name
    }

    getEmail (){
        return this.email
    }

    getPassword (){
        return this.password
    }
}
