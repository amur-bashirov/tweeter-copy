import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter} from "./UserItemPresenter";
import { PAGE_SIZE } from "./PageItemPresenter";



export class FollowerPresenter extends UserItemPresenter{

  protected itemDescription(): string {
      return "load followers";
    }
    protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[User[], boolean]> {
      console.log("loadmoreFollowers caled in presenter CALLED");
      return this.service.loadMoreFollowers(authToken, userAlias, PAGE_SIZE, this.lastItem)
    }

    
}