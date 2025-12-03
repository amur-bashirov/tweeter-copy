import { factory } from "typescript";
import { DaoFactory } from "../../dao/interfaces/DaoFactory";
import { UserDao } from "../../dao/interfaces/UserDao";

export abstract class Service{

    private _userDao: UserDao;

    constructor(factory: DaoFactory) {
        this._userDao = factory.createUserDao();
    }

    protected get userDao(): UserDao{
        return this.userDao
    }
    

    protected async validateToken(tokenString: string): Promise<boolean> {
        const tokenEntry = await this.userDao.getAuthToken(tokenString);
        

        if (!tokenEntry) return false;
        if (Date.now() > tokenEntry.expiresAt) return false;


        await this.userDao.updateTokenExpiration(tokenString);

        return true;
    }

}