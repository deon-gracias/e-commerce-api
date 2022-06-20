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
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      })
    );
  });

  // Should delete user
  it("should delete user", async () => {
    const res = await request(app)
      .delete("/users/delete")
      .set("Authorization", `Bearer ${createdUser.accessToken}`)
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
