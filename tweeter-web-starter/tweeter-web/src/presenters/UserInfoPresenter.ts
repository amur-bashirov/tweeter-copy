
import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { useNavigate } from "react-router-dom";



export interface UserInfoView{
    setIsLoading: (value: boolean) => void;
    displayErrorMessage: (message: string) => string;
    displayInfoMessage: (
        message: string,
        duration: number,
        bootstrapClasses?: string) => string,
    deleteMessage: (id: string) => void;
    setIsFollower:(isfollower: boolean) => void;
    setFollowerCount: (count : number) => void;
    setFolloweeCount: (count: number) => void;
    setUser: (user: User) => void;
}


export class UserInfoPresenter{
    private navigate = useNavigate();
    private service: FollowService;
        private view: UserInfoView;
    
    public constructor( view: UserInfoView){
        this.service = new FollowService();
        this.view = view;
    }


    public async followDisplayedUser (
     authToken: AuthToken, displayedUser: User
  ): Promise<void> {
    //event.preventDefault();

    var followingUserToast = "";

    try {
      this.view.setIsLoading(true);
      followingUserToast = this.view.displayInfoMessage(
        `Following ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.service.follow(
        authToken!,
        displayedUser!
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this.view.deleteMessage(followingUserToast);
      this.view.setIsLoading(false);
    }
  };

  public async unfollowDisplayedUser(
     displayedUser:User, authToken: AuthToken
  ): Promise<void>  {
   // event.preventDefault();

    var unfollowingUserToast = "";

    try {
      this.view.setIsLoading(true);
      unfollowingUserToast = this.view.displayInfoMessage(
        `Unfollowing ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.service.unfollow(
        authToken!,
        displayedUser!
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`,
      );
    } finally {
      this.view.deleteMessage(unfollowingUserToast);
      this.view.setIsLoading(false);
    }
  };


  public async setIsFollowerStatus (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  };

  public async setNumbFollowees(
    authToken: AuthToken,
    displayedUser: User
  ){
    try {
      this.view.setFolloweeCount(await this.service.getFolloweeCount(authToken, displayedUser));
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
            );
    }
  };

  public async setNumbFollowers (
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this.view.setFollowerCount(await this.service.getFollowerCount(authToken, displayedUser));
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  };

  public getBaseUrl(): string {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  };


  public switchToLoggedInUser( currentUser: User): void {
    this.view.setUser(currentUser!);
    this.navigate(`${this.getBaseUrl()}/${currentUser!.alias}`);
  };



}