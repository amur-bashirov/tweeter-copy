import { AuthToken } from "tweeter-shared";
import {AppNavbarPresenter, AppNavbarView } from "../../src/presenters/AppNavbarPresenter"
import {anything, capture, instance, mock, spy, verify, when} from "@typestrong/ts-mockito"
import { UserService } from "../../src/model.service/UserService";

describe("AppNavbarPresenter", () => {
    let mockAppNavbarPresenterView: AppNavbarView;
    let appNavbarPresenter: AppNavbarPresenter;
    let mockService: UserService;

    const authToken = new AuthToken("abc123", Date.now());

    beforeEach(() => {
        mockAppNavbarPresenterView = mock<AppNavbarView>();
        const mockAppNavbarPresenterViewInstance = instance(mockAppNavbarPresenterView);
        when(mockAppNavbarPresenterView.displayInfoMessage(anything(), 0)).thenReturn("mesage123");


         
        const appNavbarPresenterSpy = spy(new AppNavbarPresenter(mockAppNavbarPresenterViewInstance));
        appNavbarPresenter = instance(appNavbarPresenterSpy)

        mockService = mock<UserService>();

        when( appNavbarPresenterSpy.service).thenReturn(instance(mockService));
    })


    it("tells the view to display a logging out message", async () => {
        await appNavbarPresenter.logOut(authToken)
        verify(mockAppNavbarPresenterView.displayInfoMessage("Logging Out...", 0)).once();
    })

    it( "calls logout on the user service with the correct auth token", async () => {
        await appNavbarPresenter.logOut(authToken)
         verify(mockService.logout(authToken)).once();

        // let [capturedAuthToken] = capture(mockService.logout).last();
        // expect(capturedAuthToken).toEqual(authToken)
    })

    it(" tells the view to clear the info message that was displayed previously, clear the user info, and navigate to the login page when succesful",
         async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarPresenterView.deleteMessage("mesage123")).once();
        verify(mockAppNavbarPresenterView.clearUser()).once();
        verify(mockAppNavbarPresenterView.navigate("/login")).once();

        verify(mockAppNavbarPresenterView.displayErrorMessage(anything())).never();
    })

    it("tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page when unseccesful",
         async () => {
        let error = new Error("An error occured");
        when(mockService.logout(anything())).thenThrow(error)
        await appNavbarPresenter.logOut(authToken);
        
        let [errorString] = capture(mockAppNavbarPresenterView.displayErrorMessage).last();
        console.log(errorString);

        verify(mockAppNavbarPresenterView.displayErrorMessage(`Failed to log user out because of exception: An error occured`)).once();

        verify(mockAppNavbarPresenterView.deleteMessage(anything())).never();
        verify(mockAppNavbarPresenterView.clearUser()).never();
        verify(mockAppNavbarPresenterView.navigate("/login")).never();
    })
}) 