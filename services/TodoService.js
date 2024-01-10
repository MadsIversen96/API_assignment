const { Op } = require('sequelize');

class TodoService {
    constructor(db){
        this.client = db.sequelize;
        this.Todo = db.Todo;
        this.Status = db.Status;
        this.Category = db.Category;
    }

    async getAllNotDeleted(userId) {
        return this.Todo.findAll({
            where: {
                UserId: userId,
                StatusId: { [Op.not]: [4] }
            }
        });
    }

    async getAllDeleted(userId){
        return this.Todo.findAll({
            where: {
                UserId: userId,
                StatusId: 4
            }
        })
    }

    async getAll(userId){
        return this.Todo.findAll({
            where: {UserId: userId}
        })
    }

    async getOne(todoId){
        return this.Todo.findOne({
            where: {id: todoId}
        })
    }

    async getAllStatus(){
        return this.Status.findAll()
    }

    async update(todoId, name, description, StatusId){
        return this.Todo.update({name, description, StatusId},{
            where: {id: todoId}
        })
    }

    async create(name, description, categoryId, statusId, userId){
        const category = await this.Category.findOne({
            where: { id: categoryId, UserId: userId }
        });

        if(!category){
            throw new Error('Category does not belong to the user');
        }
        return this.Todo.create({
            name: name,
            description: description,
            CategoryId: categoryId,
            StatusId: statusId,
            UserId: userId
        })
    }

    async delete(todoId){
        return this.Todo.update(
            { StatusId: 4 },
            { where: { id: todoId } }
        );
    }


}

module.exports = TodoService;