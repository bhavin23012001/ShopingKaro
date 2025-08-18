const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Product = require("./product");

describe("Product Model Test", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  test("should create a product with valid fields", async () => {
    const productData = {
      title: "Laptop",
      price: 1200,
      description: "High performance laptop",
      imageURL: "http://example.com/laptop.jpg",
      userId: new mongoose.Types.ObjectId(),
    };

    mockingoose(Product).toReturn(productData, "save");

    const product = new Product(productData);
    const savedProduct = await product.save();

    expect(savedProduct.title).toBe("Laptop");
    expect(savedProduct.price).toBe(1200);
    expect(savedProduct.description).toBe("High performance laptop");
    expect(savedProduct.imageURL).toBe("http://example.com/laptop.jpg");
    expect(savedProduct.userId).toBeDefined();
  });

  test("should fail validation if required fields missing", async () => {
    const invalidProduct = new Product({});

    let err;
    try {
      await invalidProduct.validate();
    } catch (e) {
      err = e;
    }

    expect(err).toBeDefined();
    expect(err.errors["title"]).toBeDefined();
    expect(err.errors["price"]).toBeDefined();
    expect(err.errors["description"]).toBeDefined();
    expect(err.errors["imageURL"]).toBeDefined();
    expect(err.errors["userId"]).toBeDefined();
  });
});
