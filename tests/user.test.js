const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const User = require("./user");

describe("User Model Test", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  test("should create a user with required fields", async () => {
    const userData = {
      name: "John Doe",
      email: "john@example.com",
      cart: { items: [] },
    };

    mockingoose(User).toReturn(userData, "save");

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser.name).toBe("John Doe");
    expect(savedUser.email).toBe("john@example.com");
    expect(savedUser.cart.items).toEqual([]);
  });

  test("should add product to cart if not existing", async () => {
    const product = {
      _id: new mongoose.Types.ObjectId(),
      title: "Phone",
    };

    const user = new User({
      name: "Alice",
      email: "alice@example.com",
      cart: { items: [] },
    });

    mockingoose(User).toReturn(user, "save");

    await user.addToCart(product);

    expect(user.cart.items.length).toBe(1);
    expect(user.cart.items[0].productId.toString()).toBe(product._id.toString());
    expect(user.cart.items[0].quantity).toBe(1);
  });

  test("should increase quantity if product already exists in cart", async () => {
    const productId = new mongoose.Types.ObjectId();

    const user = new User({
      name: "Bob",
      email: "bob@example.com",
      cart: { items: [{ productId, quantity: 1 }] },
    });

    mockingoose(User).toReturn(user, "save");

    await user.addToCart({ _id: productId });

    expect(user.cart.items[0].quantity).toBe(2);
  });

  test("should delete item from cart", async () => {
    const productId = new mongoose.Types.ObjectId();

    const user = new User({
      name: "Charlie",
      email: "charlie@example.com",
      cart: { items: [{ productId, quantity: 2 }] },
    });

    mockingoose(User).toReturn(user, "save");

    await user.deleteItemFromCart(productId);

    expect(user.cart.items.length).toBe(0);
  });

  test("should clear the cart", async () => {
    const productId = new mongoose.Types.ObjectId();

    const user = new User({
      name: "Daisy",
      email: "daisy@example.com",
      cart: { items: [{ productId, quantity: 3 }] },
    });

    mockingoose(User).toReturn(user, "save");

    await user.clearCart();

    expect(user.cart.items).toEqual([]);
  });
});
