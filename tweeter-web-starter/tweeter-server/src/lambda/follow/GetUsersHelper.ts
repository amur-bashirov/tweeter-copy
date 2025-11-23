import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";



import { LambdaHelper } from "../LambdaHelper";
import { FollowLambda } from "./FollowLambdaHelper";

export const userHandler = async (
  request: PagedUserItemRequest,
  method: "loadMoreFollowers" | "loadMoreFollowees"
): Promise<PagedUserItemResponse> => {
  const h = new FollowLambda(request); 

  const serviceMethod = h.service[method].bind(h.service);

  const [items, hasMore] = await serviceMethod(
    h.token!,
    request.userAlias,
    request.pageSize,
    request.user
  );

  return LambdaHelper.success<PagedUserItemResponse>({
    items,
    hasMore
  });
};

