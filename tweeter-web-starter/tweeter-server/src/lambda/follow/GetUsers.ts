import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const userHandler = async (
  request: PagedUserItemRequest,
  method: "loadMoreFollowers" | "loadMoreFollowees"
): Promise<PagedUserItemResponse> => {

  
  const followService = new FollowService();

  
  const serviceMethod = followService[method].bind(followService);

  const [items, hasMore] = await serviceMethod(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );

  return {
    success: true,
    message: null,
    items,
    hasMore
  };
};

