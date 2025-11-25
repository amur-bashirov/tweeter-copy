import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusLambdaHelper } from "./StatusLambdaHelper";

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {

      return new StatusLambdaHelper(request).run<PostStatusRequest, TweeterResponse>(
        request,
        "postStatus",
        ["token"],         
        request.token!,
        request.newStatus 
      )
};
