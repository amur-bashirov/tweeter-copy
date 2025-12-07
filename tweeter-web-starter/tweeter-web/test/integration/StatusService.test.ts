import "isomorphic-fetch";
import { StatusService } from "../../src/model.service/StatusService";
import { AuthToken, User, Status } from "tweeter-shared";

describe("StatusService Integration Tests", () => {
  const statusService = new StatusService();

  it("retrieves a user's story pages successfully", async () => {
    
    const token = new AuthToken("abc123", Date.now());

    
    const userAlias = "@john";

    
    const pageSize = 10;

    
    const user = new User(
      "John",
      "Doe",
      "@john",
      "https://example.com/john.png"
    );

    const lastItem = new Status(
      "Hello world!",
      user,
      1699876543210 
    );

    
    const [statuses, hasMore] = await statusService.loadMoreStoryItems(
      token,
      userAlias,
      pageSize,
      lastItem
    );

    
    expect(statuses).toBeDefined();
    expect(Array.isArray(statuses)).toBe(true);
    expect(statuses.length).toBeGreaterThan(0);
    expect(hasMore).toBeDefined();
  });

    it("retrieves a user's feed pages successfully", async () => {
    
    const token = new AuthToken("abc123", Date.now());

    
    const userAlias = "@john";

    
    const pageSize = 10;

    
    const user = new User(
      "John",
      "Doe",
      "@john",
      "https://example.com/john.png"
    );

    const lastItem = new Status(
      "Hello world!",
      user,
      1699876543210 
    );

    
    const [statuses, hasMore] = await statusService.loadMoreFeedItems(
      token,
      userAlias,
      pageSize,
      null
    );
    console.log(statuses)

    
    expect(statuses).toBeDefined();
    expect(Array.isArray(statuses)).toBe(true);
    expect(statuses.length).toBeGreaterThan(0);
    expect(hasMore).toBeDefined();
  });
});
