
import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { MessageView, Presenter } from "./Presenter";
import { FollowingPresenter } from "./FolowingPresenter";



export interface UserInfoView extends MessageView{
    setIsLoading: (value: boolean) => void;
    setIsFollower:(isfollower: boolean) => void;
    setFollowerCount: (count : number) => void;
    setFolloweeCount: (count: number) => void;
}


export class UserInfoPresenter extends FollowingPresenter{
  

    
    public constructor( view: UserInfoView){
      super(view);
      
    }


    public async followDisplayedUser (
     authToken: AuthToken, displayedUser: User
  ): Promise<void> {
    //event.preventDefault();

    this.followStatusDisplayedUser(displayedUser,authToken, "Following", "follow user", this.service.follow.bind(this.service), true )
  };

  public async unfollowDisplayedUser(
     displayedUser:User, authToken: AuthToken
  ): Promise<void>  {
   // event.preventDefault();

   this.followStatusDisplayedUser(displayedUser,authToken, "Unfollowing", "unfollow user", this.service.unfollow.bind(this.service), false )
  };


  public async setIsFollowerStatus (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {

    await this.doFailureReportingOperation( async () => {
        if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    }, "determine follower");
  };

  public async setNumbFollowees(
    authToken: AuthToken,
    displayedUser: User
  ){
    await this.doFailureReportingOperation( async () => {
        this.view.setFolloweeCount(await this.service.getFolloweeCount(authToken, displayedUser));
    }, "get followees count")
  };

  public async setNumbFollowers (
    authToken: AuthToken,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation( async () => {
        this.view.setFollowerCount(await this.service.getFollowerCount(authToken, displayedUser));
    }, "get followers count");
  };

  public getBaseUrl(): string {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  };


  



}