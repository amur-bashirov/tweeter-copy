import { User, AuthToken } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { Presenter } from "./Presenter";
import { UserInfoView } from "./UserInfoPresenter";



export abstract class FollowingPresenter extends Presenter<UserInfoView>{

    private userService = new FollowService();
    
    public constructor(view: UserInfoView) {
        super(view);
    }

    protected get service(){
        return this.userService
    }





    public async followStatusDisplayedUser(
         displayedUser:User, authToken: AuthToken, itemDescription: string, statusDescription: string,
          followAction: (authToken: AuthToken, displayedUser: User) => Promise<[number, number]>, setFollower: boolean
      ): Promise<void>  {
       // event.preventDefault();
    
        var unfollowingUserToast = "";
    
        await this.doFailureReportingOperation( async () => {
            this.view.setIsLoading(true);
          unfollowingUserToast = this.view.displayInfoMessage(
            `${statusDescription} ${displayedUser!.name}...`,
            0
          );
    
          const [followerCount, followeeCount] = await followAction(authToken, displayedUser);
    
          this.view.setIsFollower(setFollower);
          this.view.setFollowerCount(followerCount);
          this.view.setFolloweeCount(followeeCount);
        }, itemDescription)
    
        this.view.deleteMessage(unfollowingUserToast);
        this.view.setIsLoading(false);
      };
      
    

}