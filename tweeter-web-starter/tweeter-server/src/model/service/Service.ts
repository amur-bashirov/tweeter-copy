import { factory } from "typescript";
import { DaoFactory } from "../../dao/interfaces/DaoFactory";
import { UserDao } from "../../dao/interfaces/UserDao";
import { AuthDao } from "../../dao/interfaces/AuthDao";

export abstract class Service{

    private _authDao: AuthDao
    private _userDao: UserDao

    constructor(factory: DaoFactory) {
        this._authDao = factory.createAuthDao();
        this._userDao = factory.createUserDao();
    }

    protected get authDao(): AuthDao{
        return this._authDao
    }

    protected get userDao(): UserDao{
        return this._userDao
    }

    protected async validate(token: string): Promise<void>{
        const valid = await this.validateToken(token);
        if (!valid){ throw new Error("Token has expired")}
    }
    

    private async validateToken(tokenString: string): Promise<boolean> {
        const tokenEntry = await this._authDao.getAuthToken(tokenString);
        

        if (!tokenEntry) return false;
        if (Date.now() > tokenEntry.expiresAt) return false;
        console.log(`date is ${Date.now()} and expirsAt ${tokenEntry.expiresAt} and it is ${Date.now() > tokenEntry.expiresAt}`)


        await this._authDao.updateTokenExpiration(tokenEntry.alias, tokenEntry.dto);

        return true;
    }

}