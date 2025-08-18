// NotFound.test.js
const request = require("supertest");
const express = require("express");
const notFoundRoute = require("../routes/NotFound");

// Mock error controller
jest.mock("../controllers/error", () => ({
  pageNotFound: (req, res) => res.status(404).send("Page Not Found"),
}));

describe("NotFound Route", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use("/", notFoundRoute);
  });

  test("should return 404 for any unmatched route", async () => {
    const res = await request(app).get("/some-random-path");
    expect(res.statusCode).toBe(404);
    expect(res.text).toBe("Page Not Found");
  });
});
