

import { LoadMoreItemRequest, LoadMoreItemsResponse, Status } from "tweeter-shared";
import { StatusLambdaHelper } from "./StatusLambdaHelper";

export const itemsHandler = async (
  request: LoadMoreItemRequest,
  method: "loadMoreStoryItems" | "loadMoreFeedItems"
): Promise<LoadMoreItemsResponse> => {
  //comment
  const lastStatus: Status | null = request.lastItem
    ? Status.fromDto(request.lastItem)
    : null;


  return new StatusLambdaHelper(request).run<LoadMoreItemRequest, LoadMoreItemsResponse>(
    request,
    method,
    ["lastItem","pageSize", "userAlias"],                
    request.token!,
    request.userAlias,
    request.pageSize,
    lastStatus  
  )
};
