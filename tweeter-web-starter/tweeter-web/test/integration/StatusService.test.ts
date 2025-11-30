import "isomorphic-fetch";
import { StatusService } from "../../src/model.service/StatusService";
import { AuthToken, User, Status } from "tweeter-shared";

describe("StatusService Integration Tests", () => {
  const statusService = new StatusService();

  it("retrieves a user's story pages successfully", async () => {
    // 1. auth token
    const token = new AuthToken("abc123", Date.now());

    // 2. user alias
    const userAlias = "@john";

    // 3. page size
    const pageSize = 10;

    // 4. Create a REAL Status object for lastItem
    const user = new User(
      "John",
      "Doe",
      "@john",
      "https://example.com/john.png"
    );

    const lastItem = new Status(
      "Hello world!",
      user,
      1699876543210 // timestamp
    );

    // 5. Call the service
    const [statuses, hasMore] = await statusService.loadMoreStoryItems(
      token,
      userAlias,
      pageSize,
      lastItem
    );

    // 6. Assertions
    expect(statuses).toBeDefined();
    expect(Array.isArray(statuses)).toBe(true);
    expect(statuses.length).toBeGreaterThan(0);
    expect(hasMore).toBeDefined();
  });
});
