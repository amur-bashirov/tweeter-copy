import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";


export interface UserNavigationHooksView{
    displayErrorMessage: (message: string) => string;
    navigate: (path: string) => void,
    setUser: (user: User) => void,
    extractAlias : (value: string) => string 
}


export class UserNavigationHooksPresenter{

    private service: UserService;
        private view: UserNavigationHooksView;
    
    public constructor( view: UserNavigationHooksView){
        this.service = new UserService();
        this.view = view;
    }


    public async navigateToUser(alias1: string, featurePath : string, authToken: AuthToken, displayedUser: User): Promise<void>  {
    

    try {
      const alias = this.view.extractAlias(alias1);

      const toUser = await this.service.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setUser(toUser);
          this.view.navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  };
}