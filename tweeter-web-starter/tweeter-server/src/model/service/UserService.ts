import { Buffer } from "buffer";
import { UserDto, AuthTokenDto } from "tweeter-shared";
import { Service } from "./Service";
import { UserDao } from "../../dao/interfaces/UserDao";
import { DaoFactory } from "../../dao/interfaces/DaoFactory";
import bcrypt from "bcryptjs";
import { MediaDao } from "../../dao/interfaces/MediaDao";



export class UserService extends Service{


  private mediaDao: MediaDao;

  constructor(factory: DaoFactory) {
    super(factory)
    this.mediaDao = factory.createImageDao();
  }


  public async getUser (
      authToken: string,
      alias: string
    ): Promise<{user: UserDto | null}>{
      await this.validate(authToken);
      const user = await this.userDao.getUserByAlias(alias);
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
    const token = await this.authDao.createToken(alias)
  
    return { user: newUser, token };
    };


  public async login(
    alias: string,
    password: string
  ): Promise<{user: UserDto, token: AuthTokenDto}>{ 

    const {userDto, passwordHash}  = await this.userDao.getUserByAliasWithHash(alias);
    let user: UserDto;
    if (!userDto){
      throw new Error("Wrong alias or password")
    }else{
      user = userDto as UserDto;
    }

    const passwordMatch = await bcrypt.compare(password, passwordHash!);

    if (!passwordMatch) {
      throw new Error("Wrong alias or password");
    }
    const token = await this.authDao.createToken(alias)


    return {user, token};
  };

  public async logout(authToken: string): Promise<void>  {
    await this.authDao.revokeAuthToken(authToken);
  };
}


