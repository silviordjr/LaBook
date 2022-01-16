export enum POST_TYPES{
    NORMAL = "NORMAL",
    EVENT = "EVENT"
  }
  
  

  export class Post {
    constructor(
      protected id: string,
      protected photo: string,
      protected desciption: string,
      protected date: string,
      protected type: POST_TYPES,
      protected userId: string
    ){}

    getId () {
      return this.id
    }

    getPhoto () {
      return this.photo
    }

    getDescription () {
      return this.desciption
    }

    getDate () {
      return this.date
    }

    getType () {
      return this.type
    }

    getUserId () {
      return this.userId
    }
  }