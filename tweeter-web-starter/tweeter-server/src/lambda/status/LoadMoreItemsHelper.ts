

import { LoadMoreItemRequest, LoadMoreItemsResponse } from "tweeter-shared";
import { StatusLambdaHelper } from "./StatusLambdaHelper";

export const itemsHandler = async (
  request: LoadMoreItemRequest,
  method: "loadMoreStoryItems" | "loadMoreFeedItems"
): Promise<LoadMoreItemsResponse> => {

  return new StatusLambdaHelper(request).run<LoadMoreItemRequest, LoadMoreItemsResponse>(
    request,
    method,
    ["lastItem","pageSize", "userAlias"],                
    request.token!,
    request.userAlias,
    request.pageSize,
    request.lastItem   
  )
};
