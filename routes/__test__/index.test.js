const request = require("supertest");
const app = require("../../app");

describe("Index", () => {
  // Checking if server is working
  it("should receive 200", async () => {
    const res = await request(app)
      .get("/")
      .expect("Content-Type", /html/)
      .expect(200);
    return expect(res.text).toMatch(/E-Commerce API/);
  });
});
