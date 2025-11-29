import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowLambda } from "./FollowLambdaHelper";

export const userHandler = async (
  request: PagedUserItemRequest,
  method: "loadMoreFollowers" | "loadMoreFollowees"
): Promise<PagedUserItemResponse> => {

  return new FollowLambda(request).run<PagedUserItemRequest, PagedUserItemResponse>(
    request,
    method,
    ["lastItem", "pageSize", "userAlias"],                 
    request.token!,
    request.userAlias,
    request.pageSize,
    request.lastItem     
  )


};

