import { Props } from "../components/authentication/login/Login";
import { UserService } from "../model.service/UserService";


export interface LoginView{
    setIsLoading: (value: boolean) => void;
    displayErrorMessage: (message: string) => string;
    navigate: (path: string) => void,
    updateUser: (user: any, user2: any, authToken: any, rememberMe: boolean) => void
}


export class LoginPresenter{

    private service: UserService;
        private view: LoginView;
    
    public constructor( view: LoginView){
        this.service = new UserService();
        this.view = view;
    }


    

    public async doLogin (alias: string, password: string, props: Props, rememberMe: boolean) {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.service.login(alias, password);

      this.view.updateUser(user, user, authToken, rememberMe);

      if (!!props.originalUrl) {
        this.view.navigate(props.originalUrl);
      } else {
        this.view.navigate(`/feed/${user.alias}`);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`,
      );
    } finally {
      this.view.setIsLoading(false);
    }
  };
}