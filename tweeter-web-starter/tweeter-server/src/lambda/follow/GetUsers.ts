import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";



import { LambdaHelper } from "../LambdaHelper";

export const userHandler = async (
  request: PagedUserItemRequest,
  method: "loadMoreFollowers" | "loadMoreFollowees"
): Promise<PagedUserItemResponse> => {

  const followService = new FollowService();


  const token = LambdaHelper.requireToken(request.token);

  const serviceMethod = followService[method].bind(followService);

  const [items, hasMore] = await serviceMethod(
    token.token,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );

  return LambdaHelper.success<PagedUserItemResponse>({
    items,
    hasMore
  });
};

