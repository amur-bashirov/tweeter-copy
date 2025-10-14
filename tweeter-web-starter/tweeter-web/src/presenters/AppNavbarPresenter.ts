import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";


export interface AppNavbarView{
    displayInfoMessage: (
        message: string,
        duration: number,
        bootstrapClasses?: string) => string;
    displayErrorMessage: (message: string) => string;
    deleteMessage: (id: string) => void;
    navigate: (path: string) => void,
    clearUser: () => void
            
}


export class AppNavbarPresenter{

    private service: UserService;
    private view: AppNavbarView;
    
    public constructor( view: AppNavbarView){
        this.service = new UserService();
        this.view = view;
    }

    public async logOut(authToken: AuthToken) {
        const loggingOutToastId = this.view.displayInfoMessage( "Logging Out...", 0);

        try {
        await this.service.logout(authToken!);

        this.view.deleteMessage(loggingOutToastId);
        this.view.clearUser();
        this.view.navigate("/login");
        } catch (error) {
        this.view.displayErrorMessage(
            `Failed to log user out because of exception: ${error}`
        );
        }
  };
}