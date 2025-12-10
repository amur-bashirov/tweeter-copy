import "isomorphic-fetch";
import "@testing-library/jest-dom"
import { ServerFacade } from "../../src/net/ServerFacade";
import { AuthToken, User } from "tweeter-shared";

jest.setTimeout(15000);

let token: AuthToken;
let user: User;
describe("ServerFacade Integration Tests", () => {

  const server = new ServerFacade();
  const alias = "@newTestuser";



  beforeAll(async () => {
    const newRequest = {
      alias: alias,
      password: "password"
    }
    const [newUser, newToken]: [User, AuthToken] = await server.login(newRequest);

    user = newUser;
    token = newToken;
    
  });


  it("logout and login user", async () => {
    const request = {
      token: token.token
    }
    await server.logout(request)
    const oldToken = token.token
    console.log('PROBABLY called logout correctly')

    const newRequest = {
      alias: alias,
      password: "password"
    }
    const [newUser, newToken]: [User, AuthToken] = await server.login(newRequest);

    user = newUser;
    token = newToken;
    expect(token.token).not.toBe(oldToken);
    expect(alias).toBe(user.alias);
  })

  // it("follow user", async () => {
  //   const [followerCount, followeeCount] = await server.follow(
  //       {
  //       "token": token.token,
  //       "user": {
  //           "firstName": "Test",
  //           "lastName": "User",
  //           "alias": "@bulat",
  //           "imageUrl": "https://amzn-s3-tweeter-amur-bashirov.s3.amazonaws.com/profile-images/@bulat.png"
  //       }
  //       }
  //   );

  //   // console.log(`follower count is ${followerCount}`)
  //   // console.log(`followee count is ${followeeCount}`)
  //   // expect(followerCount).toBe(3);
  //   // expect(followeeCount).toBe(1);
  //   });

  it("check if selected user is following", async() => {
    const follows = await server.getIsFollowerStatus(
              {
        "token": token.token,
        "user": {
            "firstName": "Test",
            "lastName": "User",
            "alias": alias,
            "imageUrl": `https://amzn-s3-tweeter-amur-bashirov.s3.amazonaws.com/profile-images/${alias}.png`
        },
        "selectedUser": {
          "firstName": "Test",
          "lastName": "User",
          "alias": "@bulat",
          "imageUrl": "https://amzn-s3-tweeter-amur-bashirov.s3.amazonaws.com/profile-images/@bulat.png"
        }
        }
    )
    expect(follows).toBe(true);
  })

  
    

  // it("gets followees", async () => {
  //   const [followees, hasMore] = await server.getMoreFollowees(
  //       {
  //       "token": token.token,
  //       "userAlias": alias,
  //       "pageSize": 10,
  //       "lastItem": null
  //       }
  //   );

  //   expect(Array.isArray(followees)).toBe(true);
  //   expect(followees.length).toBeGreaterThan(0);
  //   expect(typeof hasMore).toBe("boolean");
  //   const first = followees[0];
  //   expect(first.alias).toBe("@amur");
  //   });

  // it("gets followee count", async () => {
  //   const count = await server.getFolloweeCount(
  //       {
  //       "token": token.token,
  //       "user": {
  //           "firstName": "Test",
  //           "lastName": "User",
  //           "alias": alias,
  //           "imageUrl": "https://amzn-s3-tweeter-amur-bashirov.s3.amazonaws.com/profile-images/@newTestuser.png"
  //       }
  //       }
  //   );

  //   expect(typeof count).toBe("number");
  //   expect(count).toBeGreaterThan(0);
  // });

});
