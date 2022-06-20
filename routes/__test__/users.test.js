const request = require("supertest");

const app = require("../../app.js");
const { connectToDB, disconnectFromDB } = require("../../lib/db");
const User = require("../../models/userModel.js");

describe("User", () => {
  beforeAll(async () => {
    connectToDB();
  });

  afterAll(async () => {
    await User.deleteMany({});
    disconnectFromDB();
  });

  const user = {
    name: "deon",
    email: "deon@mail.com",
    password: "1234",
  };
  let createdUser = {};

  // Checking if server is working
  it("should sign up", async () => {
    const res = await request(app)
      .post("/users/signup")
      .send(user)
      .expect("Content-Type", /json/)
      .expect(201);

    createdUser = res.body;

    return expect(res.body).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        email: expect.any(String),
        token: expect.any(String),
      })
    );
  });

  // Should get created user
  it("should get user by id", async () => {
    const res = await request(app)
      .get(`/users/${createdUser._id}`)
      .expect("Content-Type", /json/)
      .expect(201);

    return expect(res.body).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
      })
    );
  });

  // Should delete user
  it("should delete user", async () => {
    console.log(createdUser)
    const res = await request(app)
      .delete("/users/delete")
      .send(createdUser)
      .expect("Content-Type", /json/);

    return expect(res.body).toEqual(
      expect.objectContaining({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
      })
    );
  });
});
