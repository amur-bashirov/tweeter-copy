import { Buffer } from "buffer";
import { AuthToken, User, FakeData, UserDto, AuthTokenDto } from "tweeter-shared";
import { Service } from "./Service";

export class UserService implements Service{
    public async getUser (
        authToken: AuthToken,
        alias: string
      ): Promise<UserDto | null>{
        // TODO: Replace with the result of calling server
        const user = FakeData.instance.findUserByAlias(alias);
        return User.toDto(user)
      };

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
      ): Promise<[UserDto, AuthTokenDto]> {
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        const imageStringBase64: string =
          Buffer.from(userImageBytes).toString("base64");
    
        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser;
        
    
        if (user === null) {
          throw new Error("Invalid registration");
        }

        const userDto = User.toDto(user)!
        const authDto = AuthToken.toDto(FakeData.instance.authToken)!

    
        return [userDto, authDto];
      };

    public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]>{ 
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
  };

  public async logout(authToken: AuthToken): Promise<void>  {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };

}


