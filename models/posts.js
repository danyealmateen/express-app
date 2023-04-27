const db = require('./../db_connection');


class Post {

    constructor({ id, title, slug, content }) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.slug = slug;
    }

    static async getAll() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM posts', function (error, results, fields) {
                if (error) {
                    reject(error)
                } else {
                    if (results.length > 0) {
                        resolve(results)
                    } else {
                        reject(new Error('None found'))
                    }
                }
            })
        });
    }

    static async getBySlug(slug) {

        console.log('slug')
        console.log(slug)

        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM posts WHERE slug='${slug}'`,
                function (error, results, fields) {
                    if (error) {
                        reject(error)
                    } else {
                        if (results.length > 0) {

                            resolve(results)
                        } else {
                            reject(new Error('None found'))
                        }
                    }
                })
        });
    }


    async create() {
        console.log('Post model create')
        const sql = `INSERT INTO posts
        (user_id, slug, title, content)
        VALUES
        (?,?,?, ?)
        `;
   
        const values = [1, this.slug, this.title, this.content]

        var self = this;

        const result = await db.query(sql, values, function (error, results, fields) {
            if (error) throw error;
            console.log('results.insertId')
            console.log(results.insertId)
        });
        console.log(result)
    }
}

module.exports = Post;