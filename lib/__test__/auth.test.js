const { generateAccessToken, verifyToken } = require("../auth");

describe("Auth", () => {
  const data = { name: "deon" };
  const accessToken = generateAccessToken(data);

  beforeEach(() => {
    req = {};
    res = { json: jest.fn() };
  });

  it("should generate a jwt token", () => {
    console.log(accessToken);
    expect(typeof accessToken).toEqual("string");
  });

  it("should verify jwt token", () => {
    const vdata = verifyToken(accessToken);
    expect(vdata).toEqual(expect.objectContaining(data));
  });
});
