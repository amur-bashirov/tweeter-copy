import { AuthToken, Status, User } from "tweeter-shared";
import { UserService as UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface StatusItemView extends View{
    addItems:(Items: Status[]) => void; 
}


export abstract class StatusItemPresenter extends Presenter <StatusItemView>{
    private userService: UserService;
    private _hasMoreItems = true;
    private _lastItem: Status | null = null;


    protected constructor(view: StatusItemView){
        super(view)
        this.userService = new UserService();
    }


    public get hasMoreItems(){
            return this._hasMoreItems;
        }

    protected set hasMoreItems(value: boolean){
        this._hasMoreItems = value;
    }

    protected get lastItem(){
        return this._lastItem;
    }

    protected set lastItem(value: Status | null){
        this._lastItem = value;
    }

    reset() {
          this._lastItem = null;
            this._hasMoreItems = true;
        }

    public async getUser (
        authToken: AuthToken,
        alias: string
        ): Promise<User | null>{
        return this.userService.getUser(authToken, alias)
        
        };

    public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}