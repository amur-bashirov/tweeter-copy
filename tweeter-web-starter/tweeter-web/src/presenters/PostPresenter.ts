import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";


export interface PostView {
  displayInfoMessage: (
        message: string,
        duration: number,
        bootstrapClasses?: string) => string;
  displayErrorMessage: (message: string) => string;
  deleteMessage: (id: string) => void;
  setIsLoading: (value: boolean) => void;
  clearPost: () => void;
}

export class PostPresenter{
    private service: StatusService;
    private view: PostView;

    public constructor(view: PostView) {
        this.service = new StatusService();
        this.view = view;
    }

    public async submitPost( authToken: AuthToken, post: string, currentUser: User){
    
        var postingStatusToastId = "";
    
        try {
          this.view.setIsLoading(true);
          postingStatusToastId = this.view.displayInfoMessage(
            "Posting status...",
            0
          );
    
          const status = new Status(post, currentUser!, Date.now());
    
          await this.service.postStatus(authToken!, status);
    
          this.view.clearPost();
          this.view.displayInfoMessage( "Status posted!", 2000);
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to post the status because of exception: ${error}`
          );
        } finally {
          this.view.deleteMessage(postingStatusToastId);
          this.view.setIsLoading(false);
        }
      };
}