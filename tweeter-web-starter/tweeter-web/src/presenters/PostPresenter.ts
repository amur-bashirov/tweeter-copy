import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { MessageView, Presenter } from "./Presenter";


export interface PostView extends MessageView{
  setIsLoading: (value: boolean) => void;
  clearPost: () => void;
}

export class PostPresenter extends Presenter <PostView>{
    private _service: StatusService;

    public constructor(view: PostView) {
      super(view)
        this._service = new StatusService();
    }

    public get service(){
        return this._service;
    }

    public async submitPost( authToken: AuthToken, post: string, currentUser: User){
    
        var postingStatusToastId = "";

        await this.doFailureReportingOperation( async () => {
          this.view.setIsLoading(true);
          postingStatusToastId = this.view.displayInfoMessage(
            "Posting status...",
            0
          );
    
          const status = new Status(post, currentUser!, Date.now());
    
          await this.service.postStatus(authToken!, status);
    
          this.view.clearPost();
          this.view.displayInfoMessage( "Status posted!", 2000);
        }, "post the status")

        this.view.deleteMessage(postingStatusToastId);
        this.view.setIsLoading(false);
      };
}