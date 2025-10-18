import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { View, Presenter } from "./Presenter";

export  interface PageItemView <T> extends View{
    addItems:(Items: T[]) => void; 
}

export const PAGE_SIZE = 10;


export abstract class PageItemPresenter<T, U extends Service> extends Presenter<PageItemView<T>> {
    private userService= new UserService();
    private _hasMoreItems = true;
    private _lastItem: T | null = null;
    private _service: U;

    protected constructor(view: PageItemView<T>){
        super(view);
        this._service = this.serviceFactory();
    }

    protected abstract serviceFactory(): U;

    

    public get hasMoreItems(){
        return this._hasMoreItems;
    }

    protected set hasMoreItems(value: boolean){
        this._hasMoreItems = value;
    }

    protected get lastItem(){
        return this._lastItem;
    }

    protected set lastItem(value: T | null){
        this._lastItem = value;
    }

    protected get service(){
        return this._service
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
    
    public async loadMoreItems(authToken: AuthToken, userAlias: string){
          await this.doFailureReportingOperation(async () => {
            const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);
        
              this.hasMoreItems =  hasMore;
              this.lastItem = newItems.length > 0? newItems[newItems.length - 1] : null;
              this.view.addItems(newItems);
          }, this.itemDescription());
          };

    protected abstract itemDescription(): string;
    
    protected abstract getMoreItems( authToken: AuthToken, userAlias: string): Promise<[T[], boolean]>
}