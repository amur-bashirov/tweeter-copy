import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";


export interface UserNavigationHooksView extends View{
    navigate: (path: string) => void,
    setUser: (user: User) => void,
    extractAlias : (value: string) => string 
}


export class UserNavigationHooksPresenter extends Presenter <UserNavigationHooksView>{

    private service: UserService;
    
    public constructor( view: UserNavigationHooksView){
      super(view)
        this.service = new UserService();
        
    }


    public async navigateToUser(alias1: string, featurePath : string, authToken: AuthToken, displayedUser: User): Promise<void>  {
    
      await this.doFailureReportingOperation( async () => {
        const alias = this.view.extractAlias(alias1);

      const toUser = await this.service.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setUser(toUser);
          this.view.navigate(`${featurePath}/${toUser.alias}`);
        }
      }
      }, "get user")
  };
} 