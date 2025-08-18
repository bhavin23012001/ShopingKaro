const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Order = require("./order");

describe("Order Model Test", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  test("should create an order with valid fields", async () => {
    const orderData = {
      products: [
        {
          product: { title: "Book", price: 10 },
          quantity: 2,
        },
      ],
      user: {
        name: "Bhavin",
        userId: new mongoose.Types.ObjectId(),
      },
    };

    mockingoose(Order).toReturn(orderData, "save");

    const order = new Order(orderData);
    const savedOrder = await order.save();

    expect(savedOrder.products[0].product.title).toBe("Book");
    expect(savedOrder.products[0].quantity).toBe(2);
    expect(savedOrder.user.name).toBe("Bhavin");
  });

  test("should fail validation if required fields missing", async () => {
    const invalidOrder = new Order({});

    let err;
    try {
      await invalidOrder.validate();
    } catch (e) {
      err = e;
    }

    expect(err).toBeDefined();
    expect(err.errors["products"]).toBeDefined();
    expect(err.errors["user"]).toBeDefined();
  });
});
