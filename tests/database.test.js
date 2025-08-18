// __tests__/database.test.js
const { mongoConnect, getDb } = require("../database");
const mongodb = require("mongodb");

jest.mock("mongodb", () => {
  const mDb = { collection: jest.fn() };
  const mClient = { db: jest.fn(() => mDb) };
  return {
    MongoClient: {
      connect: jest.fn(() => Promise.resolve(mClient)),
    },
  };
});

describe("Database Module", () => {
  let mockCallback;

  beforeEach(() => {
    mockCallback = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should connect to MongoDB and call the callback", async () => {
    await mongoConnect(mockCallback);

    expect(mongodb.MongoClient.connect).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalled();
  });

  it("should return db instance after connection", async () => {
    await mongoConnect(mockCallback);
    const db = getDb();
    expect(db).toBeDefined();
    expect(typeof db.collection).toBe("function");
  });

  it("should throw an error if getDb is called before connection", () => {
    jest.resetModules();
    const { getDb } = require("../database");

    expect(() => getDb()).toThrow("No Database found");
  });
});
