import "isomorphic-fetch";
import { instance, mock,verify} from "@typestrong/ts-mockito"
import { StatusService } from "../../src/model.service/StatusService";
import { ServerFacade } from "../../src/net/ServerFacade";
import { AuthToken, User } from "tweeter-shared";
import { PostPresenter, PostView } from "../../src/presenters/PostPresenter";

jest.setTimeout(20000);

describe("Post Status Integration Test", () => {
  let server: ServerFacade;

  let token: AuthToken;
  let user: User;

  beforeAll(async () => {
    server = new ServerFacade();

    // Register or login a test user
    const request = {
      alias: "@postStatusTest",
      password: "password",
      firstName: "Poster",
      lastName: "User",
      userImageBytes: Buffer.from([1, 2, 3]).toString("base64"),
      imageFileExtension: "png",
      token: "dummy-token"
    };

    try {
      [user, token] = await server.register(request);
    } catch {
      // If user exists, login instead
      [user, token] = await server.login({
        alias: request.alias,
        password: request.password
      });
    }
  });

  it("posts a status and it appears in the user's story", async () => {
    const mockView = mock<PostView>();
    const viewInstance = instance(mockView);

    // We DO NOT mock StatusService.postStatus
    // because the test must perform the real posting.

    const realStatusService = new StatusService();

    // But the Presenter normally creates its own StatusService
    // so we override it:
    const presenter = new PostPresenter(viewInstance);
    // @ts-ignore private override
    presenter.statusService = realStatusService;

    const statusText = "Hello from automated test!";

    // STEP 1 — ACT: call presenter.postStatus
    await presenter.submitPost(token, "hey", user);

    // STEP 2 — VERIFY PRESENTER CALLED VIEW
    verify(mockView.displayInfoMessage("Successfully Posted!", 10)).once();

    // STEP 3 — VERIFY STORY UPDATED
    const [story, hasMore] = await server.loadMoreStoryItems({
      token: token.token,
      userAlias: user.alias,
      pageSize: 10,
      lastItem: null
    });

    expect(story.length).toBeGreaterThan(0);
    expect(story[0].post).toBe(statusText);
    expect(story[0].user.alias).toBe(user.alias);
  });
});