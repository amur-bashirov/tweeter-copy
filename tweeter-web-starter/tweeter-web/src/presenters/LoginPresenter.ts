import { AuthToken, User } from "tweeter-shared";
import { Props } from "../components/authentication/login/Login";
import { UserService } from "../model.service/UserService";
import { AuthenticatePresenter, AuthenticateView } from "./AuthenticatePresenter";
import { Presenter, View } from "./Presenter";



export interface LoginView extends AuthenticateView{
    
}


export class LoginPresenter extends AuthenticatePresenter<LoginView>{

  public constructor( view: AuthenticateView){
    super(view)
  }


  
   protected pageDescription(user: User, props?: Props): string {
    return props?.originalUrl ?? `/feed/${user.alias}`;
}


    protected itemDescription(): string {
      return "log user";
    }
    protected authenticate(alias: string, password: string, firstName?: string, lastName?: string, imageBytes?: Uint8Array, imageFileExtension?: string): Promise<[User, AuthToken]> {
      return this.service.login(alias, password)
    }
    
  


    

  public async doLogin (alias: string, password: string, props: Props, rememberMe: boolean) {
    await this.doAuthenticate(alias, password, rememberMe, props)
  };
}