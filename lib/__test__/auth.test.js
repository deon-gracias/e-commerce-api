const {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../auth");

describe("Auth", () => {
  const data = { name: "deon", email: "deon@mail.com" };
  const accessToken = generateAccessToken(data);
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
});
