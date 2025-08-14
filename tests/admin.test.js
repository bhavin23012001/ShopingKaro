const adminController = require("../controllers/admin");
const Product = require("../models/product");

jest.mock("../models/product"); // Mock the Product model

// Mock Express req, res, next
const mockRequest = (body = {}, query = {}, params = {}, user = {}) => ({
  body,
  query,
  params,
  user
});

const mockResponse = () => {
  const res = {};
  res.render = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res;
};

describe("Admin Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getAddProduct should render add-product page", () => {
    const req = mockRequest();
    const res = mockResponse();

    adminController.getAddProduct(req, res);

    expect(res.render).toHaveBeenCalledWith("admin/edit-product", {
      pageTitle: "Add-Product",
      editing: false
    });
  });

  test("postAddProduct should save product and redirect", async () => {
    const req = mockRequest(
      {
        title: "Test Product",
        imageURL: "http://example.com/image.png",
        description: "Test description",
        price: 99.99
      },
      {},
      {},
      { _id: "user123" }
    );
    const res = mockResponse();

    Product.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(true)
    }));

    await adminController.postAddProduct(req, res);

    expect(res.redirect).toHaveBeenCalledWith("/admin/products");
  });

  test("getEditProduct should render edit-product page when product exists", async () => {
    const req = mockRequest({}, { edit: "true" }, { prodId: "prod123" });
    const res = mockResponse();

    Product.findById.mockResolvedValue({
      title: "Test Product",
      price: 50,
      description: "Test",
      imageURL: "url"
    });

    await adminController.getEditProduct(req, res);

    expect(res.render).toHaveBeenCalledWith("admin/edit-product", {
      pageTitle: "Edit-Product",
      editing: "true",
      product: {
        title: "Test Product",
        price: 50,
        description: "Test",
        imageURL: "url"
      }
    });
  });
});
