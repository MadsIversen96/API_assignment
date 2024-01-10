const express = require("express");
const request = require("supertest");
const app = express();
require('dotenv').config()

const bodyParser = require("body-parser");

var usersRouter = require('../routes/users');
var todoRouter = require('../routes/todos');
var categoryRouter = require('../routes/category');

app.use(bodyParser.json());
app.use('/', usersRouter);
app.use('/todo', todoRouter);
app.use('/category', categoryRouter);

describe("testing-todo-routes", () => {
    test("POST /signup - success", async () => {
        const newUser = {
            name: "John Doe",
            email: "johndoe@example.com",
            password: "0000"
        }
        const {body} = await request(app).post("/signup").send(newUser);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toBe("You created an account.")
    });
    
    let token;
    // Sometimes the login fails when there are already users, this does not always happen so could be a 
    // problem with my connection and not the app. If this happens, just restart and try testing again.
    test("POST /login - success", async () => {
      const credentials = {
          email: "johndoe@example.com",
          password: "0000"
      }
      const { body } = await request(app).post("/login").send(credentials);
      console.log(body);
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("token");
      expect(body.data.result).toBe("You are logged in")
      token = body.data.token;
      console.log(token);
    });

    let category;
   test("POST /category - success", async () => {
    const newCategory = {
        name: "Home"
    }
    const {body} = await request(app).post("/category").set("Authorization", "Bearer " + token).send(newCategory);
    console.log(body);
    expect(body).toHaveProperty("data");
    expect(body).toHaveProperty("status", "success");
    expect(body.data).toHaveProperty("result");

    category = body.data.result.id;
   })

   test("POST /todo - success", async () => {
    const newTodo = {
        name: "Wash clothes",
        description: "Only White clothes",
        categoryId: category,
        statusId: 1
    }
    const {body} = await request(app).post("/todo").set("Authorization", "Bearer " + token).send(newTodo);
    console.log(body);
    expect(body).toHaveProperty("data");
    expect(body).toHaveProperty("status", "success");
    expect(body.data).toHaveProperty("result");
   })

   let todo;

   test("GET /todo - success", async () => {
    const {body}  = await request(app).get("/todo").set("Authorization", "Bearer " + token);
    console.log(body)
    expect(body).toHaveProperty("status", "success");
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("result");
    expect(body.data.result).toBeInstanceOf(Array);

    console.log()
    todo = body.data.result[0].id;

  });

  test("DELETE /todo/:id - success", async () => {
    const {body}  = await request(app).delete("/todo/" + todo).set("Authorization", "Bearer " + token);
    console.log(body);
    expect(body).toHaveProperty("status", "success");
    expect(body).toHaveProperty("data");
    expect(body.data.result).toBe('Todo deleted successfully')
  });

  test("GET /todo - fail", async () => {
    const {body}  = await request(app).get("/todo");
    console.log(body)
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("result");
    expect(body.data.result).toBe('Unauthorized: No token provided')
  });

  test("GET /todo - fail", async () => {
    const {body}  = await request(app).get("/todo").set("Authorization", "Bearer " + "egufsa572gd532gh26");
    console.log(body)
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("result");
    expect(body.data.result).toBe('Unauthorized: Invalid token')

  });
  
})

