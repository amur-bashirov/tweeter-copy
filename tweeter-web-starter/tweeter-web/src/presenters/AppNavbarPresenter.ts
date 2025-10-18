import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { MessageView, Presenter } from "./Presenter";


export interface AppNavbarView extends MessageView{
    navigate: (path: string) => void,
    clearUser: () => void
            
}


export class AppNavbarPresenter extends Presenter <AppNavbarView>{

    private service: UserService;
    
    public constructor( view: AppNavbarView){
        super(view)
        this.service = new UserService();
    }

    public async logOut(authToken: AuthToken) {
        const loggingOutToastId = this.view.displayInfoMessage( "Logging Out...", 0);

        await this.doFailureReportingOperation(async () => {
            await this.service.logout(authToken!);

        this.view.deleteMessage(loggingOutToastId);
        this.view.clearUser();
        this.view.navigate("/login");
        }, "log user")
  };
}