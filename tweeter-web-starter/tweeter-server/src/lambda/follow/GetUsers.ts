import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { AuthToken } from "tweeter-shared";


export const userHandler = async (
  request: PagedUserItemRequest,
  method: "loadMoreFollowers" | "loadMoreFollowees"
): Promise<PagedUserItemResponse> => {

  
  const followService = new FollowService();

  
  const serviceMethod = followService[method].bind(followService);
  const token = AuthToken.fromDto(request.token ?? null);
  if (!token) {
    throw new Error("Missing auth token");
  }


  const [items, hasMore] = await serviceMethod(
    token.token,
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

