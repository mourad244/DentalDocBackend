const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const httpMocks = require("node-mocks-http");

jest.mock("config");

describe("auth middleware", () => {
  beforeEach(() => {
    config.get.mockClear();
  });

  it("should call next if requiresAuth is false", () => {
    config.get.mockReturnValue(false);

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    auth(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if no token is provided and requiresAuth is true", () => {
    config.get.mockReturnValue(true);

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn();

    auth(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getData()).toBe("Access denied. No token provided.");
  });

  it("should return 400 if token is invalid and requiresAuth is true", () => {
    config.get.mockReturnValue(true);

    const req = httpMocks.createRequest({
      headers: {
        "x-auth-token": "invalid-token",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    auth(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getData()).toBe("Invalid token.");
  });

  it("should populate req.user with the payload of a valid JWT if requiresAuth is true", () => {
    config.get.mockReturnValue(true);

    const payload = { _id: "user1" };
    const token = jwt.sign(payload, "jwtPrivateKey");
    const req = httpMocks.createRequest({
      headers: {
        "x-auth-token": token,
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    jwt.verify = jest.fn().mockReturnValue(payload);

    auth(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user._id).toBe("user1");
    expect(next).toHaveBeenCalled();
  });
});
