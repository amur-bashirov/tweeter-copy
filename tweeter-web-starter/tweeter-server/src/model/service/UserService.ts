import { Buffer } from "buffer";
import { AuthToken, User, FakeData, UserDto, AuthTokenDto } from "tweeter-shared";
import { Service } from "./Service";
import { UserDao } from "../../dao/interfaces/UserDao";
import { DaoFactory } from "../../dao/interfaces/DaoFactory";
import bcrypt from "bcryptjs";
import { MediaDao } from "../../dao/interfaces/MediaDao";



export class UserService extends Service{

    private userDao: UserDao;
    private mediaDao: MediaDao;

    constructor(factory: DaoFactory) {
      super(factory)
      this.userDao = factory.createUserDao();
      this.mediaDao = factory.createImageDao();
    }


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
        userImageBytes: string,
        imageFileExtension: string
      ): Promise<{user: UserDto, token:  AuthTokenDto}> {
        
      const passwordHash = await bcrypt.hash(password, 10);
      const userImageBuffer = Buffer.from(userImageBytes, "base64");
      const filename = `${alias}.${imageFileExtension}`;
      const imageUrl = await this.mediaDao.uploadProfileImage(userImageBuffer,filename, imageFileExtension);

      const newUser: UserDto = {
        alias,
        firstName,
        lastName,
        imageUrl
      };

      await this.userDao.createUser(newUser, passwordHash);
      const token = await this.createToken(alias)
    
        return { user: newUser, token };
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

  private async createToken(alias: string): Promise<AuthTokenDto>{
      const tokenValue = crypto.randomUUID();
      const token: AuthTokenDto = {
        token: tokenValue,
        timestamp: Date.now()
      };
      await this.authDao.storeAuthToken(alias, token);
      return token
  }

}


