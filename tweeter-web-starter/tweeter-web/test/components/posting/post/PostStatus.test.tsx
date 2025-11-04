import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import PostStatus from "../../../../src/components/postStatus/PostStatus";
import { UserInfoContext } from "../../../../src/components/userInfo/UserInfoContexts";
import { User, AuthToken } from "tweeter-shared";
import { PostPresenter } from "../../../../src/presenters/PostPresenter";
import { instance, mock, verify } from "@typestrong/ts-mockito";

const mockUser = new User("Test", "User", "@alias", "https://example.com/image.png");
const mockToken = new AuthToken("123", Date.now());


function renderPostWithContext(presenter?: PostPresenter) {
  return render(
    <MemoryRouter>
      <UserInfoContext.Provider
        value={{
          currentUser: mockUser,
          displayedUser: mockUser,
          authToken: mockToken,
        }}
      >
        {!! presenter ? (<PostStatus postPresenter={presenter}/>): (<PostStatus />)}
      </UserInfoContext.Provider>
    </MemoryRouter>
  );
}

function getElements(presenter?: PostPresenter) {
  const user = userEvent.setup();
  renderPostWithContext(presenter);

  const textArea = screen.getByPlaceholderText("What's on your mind?");
  const postButton = screen.getByRole("button", { name: /post status/i });
  const clearButton = screen.getByRole("button", { name: /clear/i });

  return { user, textArea, postButton, clearButton };
}

describe("PostStatus component", () => {
  it("starts with the post and clear buttons disabled", () => {
    const { postButton, clearButton } = getElements();
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables the buttons when text is entered", async () => {
    const { postButton, clearButton, textArea, user } = getElements();

    await user.type(textArea, "Hello world");

    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables the buttons again when text is cleared", async () => {
    const { postButton, clearButton, textArea, user } = getElements();

    await user.type(textArea, "Hello world");
    await user.clear(textArea);

    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("it call the presenter's postStatus method is called with correct parameters when the Post Status button is pressed",
    async () => {
    const mockPresenter = mock<PostPresenter>();
    const mockPresenterInstance = instance(mockPresenter)
    const { postButton, textArea, user } = getElements(mockPresenterInstance);

    const post = "Hello world"

    await user.type(textArea, post);  
    await user.click(postButton);    

    verify(mockPresenter.submitPost(mockToken,post,mockUser)).once();
    }
  )
});



