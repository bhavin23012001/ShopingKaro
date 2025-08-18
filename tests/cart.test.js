const fs = require("fs");
const Cart = require("./cart");

// Mock fs.readFile and fs.writeFile
jest.mock("fs");

describe("Cart Class", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should add a new product if cart is empty", () => {
    // Simulate empty file content
    fs.readFile.mockImplementation((path, cb) => {
      cb(null, JSON.stringify({ products: [], totalPrice: 0 }));
    });
    fs.writeFile.mockImplementation((path, data, cb) => cb(null));

    Cart.addproduct("p1", 100);

    expect(fs.writeFile).toHaveBeenCalled();
    const writtenData = JSON.parse(fs.writeFile.mock.calls[0][1]);
    expect(writtenData.products[0]).toEqual({ id: "p1", qty: 1 });
    expect(writtenData.totalPrice).toBe(100);
  });

  test("should increase quantity if product already exists", () => {
    const existingCart = {
      products: [{ id: "p1", qty: 1 }],
      totalPrice: 100,
    };
    fs.readFile.mockImplementation((path, cb) => {
      cb(null, JSON.stringify(existingCart));
    });
    fs.writeFile.mockImplementation((path, data, cb) => cb(null));

    Cart.addproduct("p1", 100);

    const writtenData = JSON.parse(fs.writeFile.mock.calls[0][1]);
    expect(writtenData.products[0].qty).toBe(2);
    expect(writtenData.totalPrice).toBe(200);
  });

  test("should delete product and update totalPrice", () => {
    const existingCart = {
      products: [{ id: "p1", qty: 2 }],
      totalPrice: 200,
    };
    fs.readFile.mockImplementation((path, cb) => {
      cb(null, JSON.stringify(existingCart));
    });
    fs.writeFile.mockImplementation((path, data, cb) => cb(null));

    Cart.deleteProduct("p1", 100);

    const writtenData = JSON.parse(fs.writeFile.mock.calls[0][1]);
    expect(writtenData.products.length).toBe(0);
    expect(writtenData.totalPrice).toBe(0);
  });

  test("should return if product does not exist when deleting", () => {
    const existingCart = {
      products: [{ id: "p2", qty: 1 }],
      totalPrice: 100,
    };
    fs.readFile.mockImplementation((path, cb) => {
      cb(null, JSON.stringify(existingCart));
    });

    Cart.deleteProduct("p1", 100);

    // writeFile should not be called since product not found
    expect(fs.writeFile).not.toHaveBeenCalled();
  });
});
