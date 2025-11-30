import { Buffer } from "buffer";
import { AuthToken, User, FakeData } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class UserService implements Service{
  private server = new ServerFacade();
  public async getUser (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null>{
    return await this.server.getUser({
      token: authToken.token,
      alias: alias,
    });
  };

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    return await this.server.register({
      firstName: firstName,
      lastName: lastName,
      password: password,
      alias: alias,
      userImageBytes: userImageBytes,
      imageFileExtension: imageFileExtension
    });
  };

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]>{ 
    return await this.server.login({
      password: password,
      alias: alias
    });
  };

  public async logout(authToken: AuthToken): Promise<void>  {
    return await this.server.logout({
      token: authToken.token
    });
  };

}


