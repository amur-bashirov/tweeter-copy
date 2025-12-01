import "isomorphic-fetch";
import "@testing-library/jest-dom"
import { ServerFacade } from "../../src/net/ServerFacade";

describe("ServerFacade Integration Tests", () => {

  const server = new ServerFacade();

    it("registers a user", async () => {

    const bytes = new Uint8Array([1, 2, 3, 4]);
    const base64 = Buffer.from(bytes).toString("base64");

    const request = {
        alias: "@newuser",
        password: "password",
        firstName: "Test",
        lastName: "User",
        userImageBytes: base64,       
        imageFileExtension: "png",
        token: "dummy-token"
    };

    const [user, token] = await server.register(request);

    expect(user).toBeDefined();
    expect(user.firstName).toBe("Allen"); 
    expect(token).toBeDefined();
    });

  it("gets followers", async () => {
    const [followers, hasMore] = await server.getMoreFollowers(
        {
        "token": "value1",
        "userAlias": "value2",
        "pageSize": 10,
        "lastItem": null
        }
    );

    expect(Array.isArray(followers)).toBe(true);
    expect(followers.length).toBeGreaterThan(0);
    expect(typeof hasMore).toBe("boolean");
    });

  it("gets follower count", async () => {
    const count = await server.getFollowerCount(
        {
        "token": "abc123",
        "user": {
            "firstName": "John",
            "lastName": "Doe",
            "alias": "@john",
            "imageUrl": "https://example.com/john.png"
        }
        }
    );

    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThan(0);
  });

});
