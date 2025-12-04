import { factory } from "typescript";
import { DaoFactory } from "../../dao/interfaces/DaoFactory";
import { UserDao } from "../../dao/interfaces/UserDao";
import { AuthDao } from "../../dao/interfaces/AuthDao";

export abstract class Service{

    private _authDao: AuthDao

    constructor(factory: DaoFactory) {
        this._authDao = factory.createAuthDao();
    }

    protected get authDao(): AuthDao{
        return this._authDao
    }
    

    protected async validateToken(tokenString: string): Promise<boolean> {
        const tokenEntry = await this._authDao.getAuthToken(tokenString);
        

        if (!tokenEntry) return false;
        if (Date.now() > tokenEntry.expiresAt) return false;


        await this._authDao.updateTokenExpiration(tokenString);

        return true;
    }

}