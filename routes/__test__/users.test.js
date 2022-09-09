const request = require("supertest");

const app = require("../../app.js");
const { connectToDB, disconnectFromDB } = require("../../lib/db");
const User = require("../../models/userModel.js");

describe("User", () => {
  beforeAll(() => {
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

  // Should get user by profile
  it("should get user by profile", async () => {
    const res = await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer ${createdUser.accessToken}`)
      .expect("Content-Type", /json/)
      .expect(200);

    const { accessToken, ...filteredUser } = createdUser;
    expect(res.body).toEqual(expect.objectContaining(filteredUser));
  });

  // Shouldn't get user by profile (because invalid token is passed)
  it("should not get user by profile", async () => {
    return await request(app)
      .get("/users/profile")
      .set("Authorization", `Bearer abcdefg`)
      .expect("Content-Type", /html/)
      .expect(403);
  });

  // Refresh Access Token
  it("should give a new access token", async () => {
    const res = await request(app)
      .post("/users/token")
      .send({
        refreshToken: createdUser.refreshToken,
        email: createdUser.email,
      })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({ accessToken: expect.any(String) })
    );

    createdUser.accessToken = res.body.accessToken;
  });

  // Should sign out
  it("should sign out", async () => {
    const res = await request(app)
      .get("/users/signout")
      .set("Authorization", `Bearer ${createdUser.accessToken}`)
      .expect("Content-Type", /json/)
      .expect(200);

    return expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
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
