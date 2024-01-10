var express = require('express');
var router = express.Router();
var jsend = require('jsend');
var jwt = require('jsonwebtoken')
var db = require("../models");
var CategoryService = require("../services/CategoryService");
var categoryService = new CategoryService(db)
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
router.use(jsend.middleware);

const isAuth = require('../middleware/middleware');

router.get('/', isAuth, async (req, res) => {
    // #swagger.tags = ['Categories']
    // #swagger.description = "Gets the list of all available categories. (Use token from Login response) <br>Authorization format example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjk3ODEwMzAyLCJleHAiOjE2O"<br/>"
    // #swagger.produces = ['json']
    // #swagger.responses[200] = { description: "List of categories"}
    // #swagger.responses[404] = { description: "No categories found" }
    // #swagger.responses[500] = { description: "An error occurred while fetching categories" }
    // #swagger.responses[401] = { description: "Unauthorized: No token provided" }
     // #swagger.responses[401] = { description: "Unauthorized: Invalid token" }
    try {
        const userId = req.user.id;
        const categories = await categoryService.getAllByUserId(userId);
        if(categories.length == 0){
            return res.jsend.fail({statusCode: 404, result: 'You have no categories'})
        }
        return res.jsend.success({ statusCode: 200, result: categories });
    } catch (error) {
        console.error(error);
        return res.jsend.error({ statusCode: 500, result: "An error occurred while fetching categories" });
    }
});


router.post('/', isAuth, async (req, res) => {
    // #swagger.tags = ['Categories']
    // #swagger.description = "Creates a new category.(Use token from Login response) <br>Authorization format example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjk3ODEwMzAyLCJleHAiOjE2O"<br/> 
    // #swagger.produces = ['json']
    /* #swagger.parameters['body'] =  {
    "name": "body",
    "in": "body",
      "schema": {
        $ref: "#/definitions/PostCategory"
      }
    }
  */
    // #swagger.responses[201] = { description: "Created category"}
    // #swagger.responses[400] = { description: "Missing required property" }
    // #swagger.responses[500] = { description: "An error occurred while creating category" }
    // #swagger.responses[401] = { description: "Unauthorized: No token provided" }
     // #swagger.responses[401] = { description: "Unauthorized: Invalid token" }
    try {
        const { name } = req.body;
        const { id: UserId } = req.user;
        if (!name){
            return res.jsend.fail({
              statusCode: 400,
              result: 'Missing required property',
            });
          }
        const result = await categoryService.create(name, UserId);
        return res.jsend.success({ statusCode: 201, result: result });
    } catch (error) {
        console.error(error);
        return res.jsend.error({ statusCode: 500, result: "An error occurred while creating a category" });
    }
});

router.put('/:id', isAuth, async (req, res) => {
    // #swagger.tags = ['Categories']
    // #swagger.description = "Updates a category based on their id.(Use token from Login response) <br>Authorization format example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjk3ODEwMzAyLCJleHAiOjE2O"<br/>"
    // #swagger.produces = ['json']
    /* #swagger.parameters['body'] =  {
    "name": "body",
    "in": "body",
      "schema": {
        $ref: "#/definitions/PutCategory"
      }
    }
  */
    // #swagger.responses[200] = { description: "Category updated successfully"}
    // #swagger.responses[401] = { description: "Unauthorized: You cannot update this category" }
    // #swagger.responses[404] = { description: "Category not found" }
    // #swagger.responses[500] = { description: "An error occurred while updating category" }
    // #swagger.responses[401] = { description: "Unauthorized: No token provided" }
     // #swagger.responses[401] = { description: "Unauthorized: Invalid token" }
const categoryId = req.params.id;
const userId = req.user.id;

try{
    const category = await categoryService.getOne(categoryId);

    if(!category){
        return res.jsend.fail({statusCode: 404, result: 'Category not found'})
    }

    if(category.UserId !== userId){
        return res.jsend.fail({ statusCode: 401, result: 'Unauthorized: You cannot update this category' })
    }
    const {name} = req.body;
    await categoryService.update(name, categoryId);
    res.jsend.success({ statusCode: 200, result: 'Category updated successfully' });
}catch (error) {
    console.error(error);
    return res.jsend.error({ statusCode: 500, message: 'An error occurred while updating the category' })
 }
});

router.delete('/:id', isAuth, async (req, res) => {
    // #swagger.tags = ['Categories']
    // #swagger.description = "Deletes a category based on their id. (Use token from Login response) <br>Authorization format example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjk3ODEwMzAyLCJleHAiOjE2O"<br/>"
    // #swagger.produces = ['json']
    // #swagger.responses[200] = { description: "Category updated successfully"}
    // #swagger.responses[401] = { description: "Unauthorized: You cannot delete this category" }
    // #swagger.responses[404] = { description: "Category not found" }
    // #swagger.responses[500] = { description: "An error occurred while deleting category" }
    // #swagger.responses[401] = { description: "Unauthorized: No token provided" }
    // #swagger.responses[401] = { description: "Unauthorized: Invalid token" }
const categoryId = req.params.id;
const userId = req.user.id;

 try {
    const category = await categoryService.getOne(categoryId);

    if(!category){
        return res.jsend.fail({statusCode: 404, result: 'Category not found'})
    }
    console.log(category.UserId)
    console.log(userId)
    if(category.UserId !== userId){
        return res.jsend.fail({ statusCode: 401, result: 'Unauthorized: You cannot delete this category' })
    }

    await categoryService.delete(categoryId);
    res.jsend.success({statusCode: 200, result: 'Category deleted successfully'})
 } catch (error) {
    console.error(error);
    return res.jsend.error( {statusCode: 500, message: error.message })
 }
});


module.exports = router;