const request = require("supertest");
const app = require("../../app");
const { connectToDB, disconnectFromDB } = require("../../lib/db");
const Product = require("../../models/productModel");

describe("Products", () => {
  beforeAll(() => {
    connectToDB();
  });

  afterAll(async () => {
    await Product.deleteMany({});
    disconnectFromDB();
  });

  let product = {
    name: "Product 1",
    description: "This is product 1",
    price: 1000,
    category: "Misc",
    quantity: 1200,
    images: ["Image 1", "Image 2"],
    variants: [
      { name: "Blue", price: 1200, description: "Product 1 in blue color" },
    ],
  };

  // Get all products
  it("should get all products", async () => {
    const res = await request(app)
      .get("/products")
      .expect("Content-Type", /json/)
      .expect(200);

    return expect(res.body).toEqual([]);
  });

  // Add new product
  it("should add new product", async () => {
    const res = await request(app)
      .post("/products")
      .send(product)
      .expect(201)
      .expect("Content-Type", /json/);

    expect(res.body).toMatchObject({
      _id: expect.any(String),
      ...product,
    });

    product = res.body;
  });

  // Get all products
  it("should get all products", async () => {
    const res = await request(app)
      .get("/products")
      .expect("Content-Type", /json/)
      .expect(200);

    // return expect(res.body).toEqual(
    //   expect.arrayContaininig([expect.toMatchObject(product)])
    // );
  });

  // Get product by id
  it("should get product by id", async () => {
    const res = await request(app)
      .get(`/products/${product._id}`)
      .expect(200)
      .expect("Content-Type", /json/);

    return expect(res.body).toMatchObject(product);
  });

  // Update product by id
  it("should update product by id", async () => {
    product.name = "Product 2";
    product.description = "This is product 2";
    product.price -= 500;
    product.quantity -= 1000;

    const res = await request(app)
      .put(`/products/${product._id}`)
      .send({
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
      })
      .expect(200)
      .expect("Content-Type", /json/);

    delete product.updatedAt;
    expect(res.body).toMatchObject(product);

    product = res.body;
  });

  // Delete product by id
  it("should delete product by id", async () => {
    const res = await request(app)
      .delete(`/products/${product._id}`)
      .expect(200)
      .expect("Content-Type", /json/);

    return expect(res.body).toMatchObject(product);
  });
});
