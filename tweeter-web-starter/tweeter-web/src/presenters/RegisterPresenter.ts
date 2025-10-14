
import { UserService } from "../model.service/UserService";


export interface RegisterView{
    setIsLoading: (value: boolean) => void;
    displayErrorMessage: (message: string) => string;
    navigate: (path: string) => void,
    updateUser: (user: any, user2: any, authToken: any, rememberMe: boolean) => void
}

export class RegisterPresenter{
    private service: UserService;
    private view: RegisterView;

    public constructor( view: RegisterView){
        this.service = new UserService();
        this.view = view;
    }

    

    public async doRegister(firstName: string, lastName: string, alias: string, password: string,
        imageBytes: Uint8Array, imageFileExtension: string, rememberMe: boolean
     ) {


    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      this.view.updateUser(user, user, authToken, rememberMe);
      this.view.navigate(`/feed/${user.alias}`);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`,
      );
    } finally {
      this.view.setIsLoading(false);
    }
  };
}