import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowLambda } from "./FollowLambdaHelper";

export const userHandler = async (
  request: PagedUserItemRequest,
  method: "loadMoreFollowers" | "loadMoreFollowees"
): Promise<PagedUserItemResponse> => {

  return new FollowLambda(request, request.user!).run<PagedUserItemRequest, PagedUserItemResponse>(
    request,
    method,
    [],                 
    request.token!,
    request.userAlias,
    request.pageSize,
    request.user     
  )


};

