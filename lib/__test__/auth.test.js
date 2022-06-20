const { TokenExpiredError } = require("jsonwebtoken");
const {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../auth");

describe("Auth", () => {
  jest.setTimeout(20000);

  const data = { name: "deon", email: "deon@mail.com" };
  const accessToken = generateAccessToken(data, "1s");
  const refreshToken = generateRefreshToken(data);

  it("should generate a jwt access token", () => {
    expect(typeof accessToken).toEqual("string");
  });

  it("should verify jwt access token", () => {
    const vdata = verifyAccessToken(accessToken);
    expect(vdata).toEqual(expect.objectContaining(data));
  });

  it("should generate a jwt refresh token", () => {
    expect(typeof refreshToken).toEqual("string");
  });

  it("should verify jwt refresh token", () => {
    const vdata = verifyRefreshToken(refreshToken);
    expect(vdata).toEqual(expect.objectContaining(data));
  });

  it("should not verify jwt access token", async () => {
    expect.assertions(1);
    await new Promise((r) => setTimeout(r, 1000));
    try {
      verifyAccessToken(accessToken);
    } catch (err) {
      expect(err).toEqual(new TokenExpiredError("jwt expired"));
    }
  });
});
