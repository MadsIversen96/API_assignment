class CategoryService {
    constructor(db){
        this.client = db.sequelize;
        this.Category = db.Category;
        this.Todo = db.Todo;
    }

    async getAll(){
        return this.Category.findAll()
    }

    async getAllByUserId(userId){
        return this.Category.findAll({
            where: {UserId: userId}
        })
    }

    async getOne(categoryId){
        return this.Category.findOne({
            where: {id: categoryId}
        })
    }

    async create(name, UserId) {
        return this.Category.create({
            name: name,
            UserId: UserId 
        });
    }

    async update(name, categoryId){
        return this.Category.update({name}, {
            where: {id: categoryId}
        })
    }

    async delete(categoryId){
        const todos = await this.Todo.findAll({
            where: {CategoryId: categoryId}
        })
        if(todos.length > 0){
            throw new Error('Cant delete a populated category');
        }
        return this.Category.destroy({
            where: {id: categoryId}
        })
    }
}

module.exports = CategoryService;