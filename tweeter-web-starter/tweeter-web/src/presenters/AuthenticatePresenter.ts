import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";
import { Props } from "../components/authentication/login/Login";



export  interface AuthenticateView extends View{
    setIsLoading: (value: boolean) => void;
    navigate: (path: string) => void,
    updateUser: (user: any, user2: any, authToken: any, rememberMe: boolean) => void;
}




export abstract class AuthenticatePresenter<V extends AuthenticateView> extends Presenter<V> {
    private userService = new UserService();

    public constructor(view: V) {
        super(view);
    }

    protected get service(){
        return this.userService
    }


    public async doAuthenticate(alias: string, password: string,rememberMe: boolean, props: Props | undefined, firstName?: string, lastName?: string,
        imageBytes?: Uint8Array, imageFileExtension?: string , 
     ) {
        await this.doFailureReportingOperation( async () => {
          this.view.setIsLoading(true);

      const [user, authToken] = await this.authenticate(
        alias,
        password,
        firstName,
        lastName,
        imageBytes,
        imageFileExtension
      );

      this.view.updateUser(user, user, authToken, rememberMe);
      if (props === undefined){
        this.view.navigate(this.pageDescription(user, props));
      }else {
        this.view.navigate(this.pageDescription(user));
      }
        }, this.itemDescription());
      this.view.setIsLoading(false);
  };

  protected abstract pageDescription(user: User, props?: Props): string;

  protected abstract itemDescription(): string;

  protected abstract authenticate(alias: string, password: string, firstName?: string, lastName?: string,
        imageBytes?: Uint8Array, imageFileExtension?: string ): Promise<[User, AuthToken]>
}
