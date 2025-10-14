import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserItemView{
  addItems:(Items: User[]) => void; 
  displayErrorMessage: (message: string) => void;
}

export abstract class UserItemPresenter {
        
        
        private _view: UserItemView
        private userService: UserService;

        private _hasMoreItems = true;
        private _lastItem: User | null = null;

        protected constructor(view: UserItemView){
            this._view = view;
            this.userService = new UserService();
        }

        protected get view(){ 
            return this._view;
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

        protected set lastItem(value: User | null){
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