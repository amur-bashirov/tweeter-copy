import { Props } from "../components/authentication/login/Login";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";


export interface LoginView extends View{
    setIsLoading: (value: boolean) => void;
    displayErrorMessage: (message: string) => string;
    navigate: (path: string) => void,
    updateUser: (user: any, user2: any, authToken: any, rememberMe: boolean) => void
}


export class LoginPresenter extends Presenter <LoginView>{

    private service: UserService;
    
    public constructor( view: LoginView){
      super(view)
        this.service = new UserService();
    }


    

    public async doLogin (alias: string, password: string, props: Props, rememberMe: boolean) {
      await this.doFailureReportingOperation( async () => {
        this.view.setIsLoading(true);

      const [user, authToken] = await this.service.login(alias, password);

      this.view.updateUser(user, user, authToken, rememberMe);

      if (!!props.originalUrl) {
        this.view.navigate(props.originalUrl);
      } else {
        this.view.navigate(`/feed/${user.alias}`);
      }
      }, "log user")
      this.view.setIsLoading(false);
  };
}