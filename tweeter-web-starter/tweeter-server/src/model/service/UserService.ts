import { Buffer } from "buffer";
import { AuthToken, User, FakeData, UserDto, AuthTokenDto } from "tweeter-shared";
import { Service } from "./Service";

export class UserService implements Service{
    public async getUser (
        authToken: string,
        alias: string
      ): Promise<{user: UserDto | null}>{
        // TODO: Replace with the result of calling server
        const user1 = FakeData.instance.findUserByAlias(alias);
        const user = User.toDto(user1)
        return {user}
      };

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
      ): Promise<{user: UserDto, token:  AuthTokenDto}> {
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        const imageStringBase64: string =
          Buffer.from(userImageBytes).toString("base64");
    
        // TODO: Replace with the result of calling the server
        const user1 = FakeData.instance.firstUser;
        
    
        if (user1 === null) {
          throw new Error("Invalid registration");
        }

        const user = User.toDto(user1)!
        const token = AuthToken.toDto(FakeData.instance.authToken)!

    
        return {user, token};
      };

    public async login(
    alias: string,
    password: string
  ): Promise<{user: UserDto, token: AuthTokenDto}>{ 
    // TODO: Replace with the result of calling the server
    const user1 = FakeData.instance.firstUser;

    if (user1 === null) {
      throw new Error("Invalid alias or password");
    }

    const user = User.toDto(user1)!
    const token = AuthToken.toDto(FakeData.instance.authToken)!

    return {user, token};
  };

  public async logout(authToken: string): Promise<void>  {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };

}


