var express = require('express');
var router = express.Router();
var jsend = require('jsend');
var jwt = require('jsonwebtoken')
var db = require("../models");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var TodoService = require("../services/TodoService");
var todoService = new TodoService(db)
const isAuth = require('../middleware/middleware');

router.use(jsend.middleware);
/* Return all the logged in users todo's with the category associated with each todo and
status that is not the deleted status */
router.get('/', isAuth, async (req, res) => {
	// #swagger.tags = ['Todos']
    // #swagger.description = "Gets the list of all the logged in users todos that does not have the DELETED status. (Use token from Login response) <br>Authorization format example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjk3ODEwMzAyLCJleHAiOjE2O"<br/>"
    // #swagger.produces = ['json']
    // #swagger.responses[200] = { description: "List of non deleted todos"}
    // #swagger.responses[404] = { description: "No todos found for the user" }
    // #swagger.responses[500] = { description: "An error occurred while fetching todos" }
    // #swagger.responses[401] = { description: "Unauthorized: No token provided" }
    // #swagger.responses[401] = { description: "Unauthorized: Invalid token" }
	try{
		const userId = req.user.id;
		const todos = await todoService.getAllNotDeleted(userId);
		if (todos == 0) {
			return res.jsend.fail({ statusCode: 404, result: 'No todos found for the user' });
		  }
		return res.jsend.success({ statusCode: 200, result: todos });
	} catch (error){
		console.error(error);
        return res.jsend.error({ statusCode: 500, message: "An error occurred while fetching todos" });
	}
});

// Return all the users todos including todos with a deleted status
router.get('/all', isAuth, async(req, res) => {
	// #swagger.tags = ['Todos']
    // #swagger.description = "Gets the list of all the logged in users todos, all statuses included. (Use token from Login response) <br>Authorization format example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjk3ODEwMzAyLCJleHAiOjE2O"<br/>"
    // #swagger.produces = ['json']
    // #swagger.responses[200] = { description: "List of all todos"}
    // #swagger.responses[404] = { description: "No todos found for the user" }
    // #swagger.responses[500] = { description: "An error occurred while fetching todos" }
    // #swagger.responses[401] = { description: "Unauthorized: No token provided" }
    // #swagger.responses[401] = { description: "Unauthorized: Invalid token" }
	try{
		const userId = req.user.id;
		const allTodos = await todoService.getAll(userId);
		if (allTodos == 0) {
			return res.jsend.fail({ statusCode: 404, result: 'No todos found for the user' });
		  }
		return res.jsend.success({statusCode: 200, result: allTodos})
		}catch(error){
			console.log(error);
			return res.jsend.error({stastusCode: 500, message: "An error occurred while fetching all todos"});
	}
});

// Return all the todos with the deleted status
router.get('/deleted', isAuth, async(req, res) => {
	// #swagger.tags = ['Todos']
    // #swagger.description = "Gets the list of all the logged in users todos that have a DELETED status. (Use token from Login response) <br>Authorization format example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjk3ODEwMzAyLCJleHAiOjE2O"<br/>"
    // #swagger.produces = ['json']
    // #swagger.responses[200] = { description: "List of todos"}
    // #swagger.responses[404] = { description: "No todos found for the user" }
    // #swagger.responses[500] = { description: "An error occurred while fetching todos" }
    // #swagger.responses[401] = { description: "Unauthorized: No token provided" }
    // #swagger.responses[401] = { description: "Unauthorized: Invalid token" }
	try{
		const userId = req.user.id;
		const deletedTodos = await todoService.getAllDeleted(userId);
		if(deletedTodos == 0){
			return res.jsend.fail({statusCode: 404, result: 'You have no deleted todos'})
		}
		return res.jsend.success({statusCode: 200, result: deletedTodos})
	}catch(error){
		console.log(error);
			return res.jsend.error({stastusCode: 500, message: "An error occurred while fetching all deleted todos"});
	}
});

// Add a new todo with their category for the logged in user
router.post('/', isAuth, async (req, res) => {
	// #swagger.tags = ['Todos']
    // #swagger.description = "The logged in user can add a new todo. (Use token from Login response) <br>Authorization format example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjk3ODEwMzAyLCJleHAiOjE2O"<br/>"
    // #swagger.produces = ['json']
	/* #swagger.parameters['body'] =  {
    "name": "body",
    "in": "body",
      "schema": {
        $ref: "#/definitions/PostTodo"
      }
    }
  */
    // #swagger.responses[200] = { description: "The new todo added"}
    // #swagger.responses[400] = { description: "Missing required properties" }
    // #swagger.responses[500] = { description: "An error occurred while trying to add a new todo" }
    // #swagger.responses[401] = { description: "Unauthorized: No token provided" }
    // #swagger.responses[401] = { description: "Unauthorized: Invalid token" }
	try {
	  const { name, description, categoryId, statusId } = req.body;
	  const { id: userId } = req.user;
  
	  if (!name || !description || !categoryId || !statusId) {
		return res.jsend.fail({
		  statusCode: 400,
		  result: 'Missing required properties',
		});
	  }

	  const result = await todoService.create(name, description, categoryId, statusId, userId);
  
	  return res.jsend.success({ statusCode: 201, result: result });
	} catch (error) {
	  console.error('Error:', error);
	  return res.jsend.error({ statusCode: 500, message: 'An error occurred while trying to add a new todo' });
	}
  });

// Return all the statuses from the database
router.get('/statuses', isAuth, async (req, res) => {
	// #swagger.tags = ['Todos']
    // #swagger.description = "Get a list of all the available statuses. (Use token from Login response) <br>Authorization format example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjk3ODEwMzAyLCJleHAiOjE2O"<br/>"
    // #swagger.produces = ['json']
    // #swagger.responses[200] = { description: "List of statuses"}
    // #swagger.responses[404] = { description: "No statuses found" }
    // #swagger.responses[500] = { description: "An error occurred while fetching all statuses" }
    // #swagger.responses[401] = { description: "Unauthorized: No token provided" }
    // #swagger.responses[401] = { description: "Unauthorized: Invalid token" }
	try{
		const statuses = await todoService.getAllStatus();
		if(statuses == 0){
			return res.jsend.fail({statusCode: 404, result: 'No statuses found'})
		}
		return res.jsend.success({statusCode: 200, result: statuses});
	}catch{
		console.error('Error:', error);
	  return res.jsend.error({ statusCode: 500, message: 'An error occurred while fetching all statuses' });
	}
});

// Updates a specific todo for logged in user
router.put('/:id', isAuth, async(req, res) => {
	// #swagger.tags = ['Todos']
    // #swagger.description = "Updates an todo based on their id. (Use token from Login response) <br>Authorization format example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjk3ODEwMzAyLCJleHAiOjE2O"<br/>"
    // #swagger.produces = ['json']
	/* #swagger.parameters['body'] =  {
    "name": "body",
    "in": "body",
      "schema": {
        $ref: "#/definitions/PutTodo"
      }
    }
  */
    // #swagger.responses[200] = { description: "Todo updated successfully"}
    // #swagger.responses[404] = { description: "No todo found" }
    // #swagger.responses[500] = { description: "An error occurred while updating the todo" }
    // #swagger.responses[401] = { description: "Unauthorized: No token provided" }
    // #swagger.responses[401] = { description: "Unauthorized: Invalid token" }
	const todoId = req.params.id;
	const userId = req.user.id;

	try{
 	   const todo = await todoService.getOne(todoId);

 	   if(!todo){
 	       return res.jsend.fail({statusCode: 404, result: 'Todo not found'})
 	   }

	    if(todo.UserId !== userId){
	        return res.jsend.fail({ statusCode: 401, result: 'Unauthorized: You cannot update this todo' })
	    }
	    const {name, description, StatusId} = req.body;
	    await todoService.update(todoId, name, description, StatusId);
	    res.jsend.success({ statusCode: 200, result: 'Todo updated successfully (If did not update, make sure property was correct)' });
	}catch (error) {
 	   console.error(error);
	    return res.jsend.error({ statusCode: 500, message: 'An error occurred while updating the todo' })
	 }
});

// Delete a specific todo if for the logged in user
router.delete('/:id', isAuth, async (req, res) => {
	// #swagger.tags = ['Todos']
    // #swagger.description = "Delete a specific todo based on their id for the logged in user. (Use token from Login response) <br>Authorization format example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjk3ODEwMzAyLCJleHAiOjE2O"<br/>"
    // #swagger.produces = ['json']
    // #swagger.responses[200] = { description: "Todo deleted successfully"}
    // #swagger.responses[404] = { description: "No todo found" }
    // #swagger.responses[500] = { description: "An error occurred while deleting the todo" }
    // #swagger.responses[401] = { description: "Unauthorized: No token provided" }
    // #swagger.responses[401] = { description: "Unauthorized: Invalid token" }
	const todoId = req.params.id;
	const userId = req.user.id;
	
	 try {
		const todo = await todoService.getOne(todoId);
	
		if(!todo){
			return res.jsend.fail({statusCode: 404, result: 'Todo not found'})
		}
		console.log(todo.UserId)
		console.log(userId)
		if(todo.UserId !== userId){
			return res.jsend.fail({ statusCode: 401, result: 'Unauthorized: You cannot delete this category' })
		}
	
		await todoService.delete(todoId);
		res.jsend.success({statusCode: 200, result: 'Todo deleted successfully'})
	 } catch (error) {
		console.error(error);
		return res.jsend.error( {statusCode: 500, result: 'An error occurred while deleting the todo'})
	 }
	});

module.exports = router;

