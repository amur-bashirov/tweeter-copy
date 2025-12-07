import "isomorphic-fetch";
import "@testing-library/jest-dom"
import { ServerFacade } from "../../src/net/ServerFacade";
import { AuthToken, User } from "tweeter-shared";

describe("ServerFacade Integration Tests", () => {

  const server = new ServerFacade();
  let token: AuthToken;
  let user: User;
  const alias = "@newTestuser";

  it("registers a user", async () => {

  const bytes = new Uint8Array([1, 2, 3, 4]);
  const base64 = Buffer.from(bytes).toString("base64");

  const request = {
      alias: alias,
      password: "password",
      firstName: "Test",
      lastName: "User",
      userImageBytes: base64,       
      imageFileExtension: "png",
      token: "dummy-token"
  };

  [user, token] = await server.register(request);

  expect(user).toBeDefined();
  expect(user.firstName).toBe("Test"); 
  expect(token).toBeDefined();
  });

  it("follow user", async () => {
    const [followerCount, followeeCount] = await server.follow(
        {
        "token": token.token,
        "user": {
            "firstName": "Test",
            "lastName": "User",
            "alias": "@amur",
            "imageUrl": "https://amzn-s3-tweeter-amur-bashirov.s3.amazonaws.com/profile-images/@amur.png"
        }
        }
    );

    console.log(`follower count is ${followerCount}`)
    console.log(`followee count is ${followeeCount}`)
    expect(followerCount).toBe(3);
    expect(followeeCount).toBe(1);
    });

  
    

  it("gets followees", async () => {
    const [followees, hasMore] = await server.getMoreFollowees(
        {
        "token": token.token,
        "userAlias": alias,
        "pageSize": 10,
        "lastItem": null
        }
    );

    expect(Array.isArray(followees)).toBe(true);
    expect(followees.length).toBeGreaterThan(0);
    expect(typeof hasMore).toBe("boolean");
    });

  it("gets followee count", async () => {
    const count = await server.getFolloweeCount(
        {
        "token": token.token,
        "user": {
            "firstName": "Test",
            "lastName": "User",
            "alias": alias,
            "imageUrl": "https://amzn-s3-tweeter-amur-bashirov.s3.amazonaws.com/profile-images/@newTestuser.png"
        }
        }
    );

    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThan(0);
  });

});
