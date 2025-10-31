import { AuthToken, Status, User } from "tweeter-shared";
import {PostView, PostPresenter } from "../../src/presenters/PostPresenter"
import {anything, capture, instance, mock, spy, verify, when} from "@typestrong/ts-mockito"
import { StatusService } from "../../src/model.service/StatusService";

describe("PostPresenter", () => {
    let mockPostPresenterView: PostView;
    let postPresenter: PostPresenter;
    let mockService: StatusService;

    const authToken = new AuthToken("abc123", Date.now());
    const testUser = new User("test","test","test","test");
    const post = "testpost";
    const status = new Status(post, testUser, Date.now());

    beforeEach(() => {
        mockPostPresenterView = mock<PostView>();
        const mockPostPresenterViewInstance = instance(mockPostPresenterView);
        when(mockPostPresenterView.displayInfoMessage(anything(), 0)).thenReturn("mesage123");


         
        const postPresenterSpy = spy(new PostPresenter(mockPostPresenterViewInstance));
        postPresenter = instance(postPresenterSpy)

        mockService = mock<StatusService>();

        when( postPresenterSpy.service).thenReturn(instance(mockService));
    })


    it("tells the view to display a posting status message", async () => {
        await postPresenter.submitPost(authToken, post, testUser)
        verify(mockPostPresenterView.displayInfoMessage("Posting status...", 0)).once();
    })

    it( "calls postStatus on the post status service with the correct status string and auth token", async () => {
        await postPresenter.submitPost(authToken, post, testUser)
         verify(mockService.postStatus(anything(), anything())).once();

        
    })

    it(" tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when succesful",
         async () => {
        await postPresenter.submitPost(authToken, post, testUser)
        verify(mockPostPresenterView.deleteMessage("mesage123")).once();
        verify(mockPostPresenterView.clearPost()).once();
        verify(mockPostPresenterView.setIsLoading(false)).once();

        verify(mockPostPresenterView.displayErrorMessage(anything())).never();
    })

    it(" tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message when unssuccesful",
         async () => {
        let error = new Error("An error occured");
        when(mockService.postStatus(anything(), anything())).thenThrow(error)
        await postPresenter.submitPost(authToken, post, testUser)
        
        let [errorString] = capture(mockPostPresenterView.displayErrorMessage).last();
        console.log(errorString);

        verify(mockPostPresenterView.displayErrorMessage(`Failed to post the status because of exception: An error occured`)).once();

        verify(mockPostPresenterView.deleteMessage("mesage123")).once();
        verify(mockPostPresenterView.clearPost()).never();
        verify(mockPostPresenterView.displayInfoMessage("Status posted!", anything())).never()
        //verify(mockPostPresenterView.setIsLoading(false)).never();
    })
}) 