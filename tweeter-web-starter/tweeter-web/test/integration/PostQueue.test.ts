import "isomorphic-fetch";
import { instance, mock,verify} from "@typestrong/ts-mockito"
import { StatusService } from "../../src/model.service/StatusService";
import { ServerFacade } from "../../src/net/ServerFacade";
import { AuthToken, User } from "tweeter-shared";
import { PostPresenter, PostView } from "../../src/presenters/PostPresenter";

jest.setTimeout(20000);

function generateRandomStringSimple(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



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

  it("posts a status and sees it appear in story", async () => {
    const mockView = mock<PostView>();
    const viewInstance = instance(mockView);
    const realStatusService = new StatusService();

    // Presenter with real service
    const presenter = new PostPresenter(viewInstance);

    // Override private field
    // (TypeScript will allow this with @ts-ignore)
    // eslint-disable-next-line
    // @ts-ignore
    presenter.statusService = realStatusService;

    const statusText = generateRandomStringSimple(10);

    // POST the status
    await presenter.submitPost(token, statusText, user);

    // Presenter UI logic check
    verify(mockView.displayInfoMessage("Status posted!", 2000)).once();

    // NOW VERIFY BACKEND UPDATED STORY
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