import connection from "./connection"

const printError = (error: any) => { console.log(error.sqlMessage || error.message) }

const createTables = () => connection.raw(`
    CREATE TABLE labook_users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    );

    CREATE TABLE labook_posts (
        id VARCHAR(255) PRIMARY KEY,
        photo VARCHAR(255) NOT NULL,
        description VARCHAR(255),
        date DATE NOT NULL,
        type ENUM ('NORMAL', 'EVENT') DEFAULT 'NORMAL',
        user_id VARCHAR(255) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES labook_users(id)
    );

    CREATE TABLE labook_friendship (
        first_user_id VARCHAR(255) NOT NULL,
        second_user_id VARCHAR (255) NOT NULL,
        FOREIGN KEY (first_user_id) REFERENCES labook_users(id),
        FOREIGN KEY (second_user_id) REFERENCES labook_users(id)
    );

    CREATE TABLE labook_likes (
        post_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        FOREIGN KEY (post_id) REFERENCES labook_posts(id),
        FOREIGN KEY (user_id) REFERENCES labook_users(id)
    );

    CREATE TABLE labook_comments (
        id VARCHAR(255) PRIMARY KEY,
        comment VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        post_id VARCHAR(255) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES labook_users(id),
        FOREIGN KEY (post_id) REFERENCES labook_posts(id)
    );
`)
    .then(() => { console.log("Tabelas criadas") })
    .catch(printError)

createTables()