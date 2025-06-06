import { test, expect } from "@playwright/test";

export default function userTestCollection() {
  test("Valid user registration info ", async ({ request }) => {
    test.setTimeout(10_000);

    //Arrange
    const user = {
      username: "John Doe",
      email: "john@example.com",
      password: "password",
    };

    //Act
    const response = await request.post("/api/auth/register", { data: user });
    const json = await response.json();

    //Assert
    expect(response.status()).toBe(201);
    expect(json.error).toBeNull();
  });

  test("Invalid user registration info ", async ({ request }) => {
    test.setTimeout(10_000);

    //Arrange
    const user = {
      username: "John Doe",
      email: "john@example.com",
      password: "pass", //invalid passwod according to Joi schema
    };

    //Act
    const response = await request.post("/api/auth/register", { data: user });
    const json = await response.json();

    //Assert
    expect(response.status()).toBe(400);
    //console.log(json.error)
    expect(json.error).toEqual(
      'Validation error: "password" length must be at least 6 characters long'
    );
  });

  test("Valid login", async ({ request }) => {
    const user = {
      username: "John Doe",
      email: "john@example.com",
      password: "password",
    };

    // Register the user
    await request.post("/api/auth/register", { data: user });

    // Attempt login
    const credentials = { email: user.email, password: user.password };
    const response = await request.post("/api/auth/login", {
      data: credentials,
    });

    expect(response.status()).toBe(200);
  });

  test("Invalid login", async ({ request }) => {
    const credentials = { email: "john@example.com", password: "wrongpass" };
    const response = await request.post("/api/auth/login", {
      data: credentials,
    });
    expect(response.status()).toBe(401);
  });
}
