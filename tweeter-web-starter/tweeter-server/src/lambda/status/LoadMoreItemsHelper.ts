

import { LoadMoreItemRequest, LoadMoreItemsResponse,} from "tweeter-shared";



import { LambdaHelper } from "../LambdaHelper";
import { StatusLambdaHelper } from "./StatusLambdaHelper";


export const itemsHandler = async (
  request: LoadMoreItemRequest,
  method: "loadMoreStoryItems" | "loadMoreFeedItems"
): Promise<LoadMoreItemsResponse> => {
  const h = new StatusLambdaHelper(request); 

  const serviceMethod = h.service[method].bind(h.service);

  const [statuses, bool] = await serviceMethod(
    h.token!,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );

  return LambdaHelper.success<LoadMoreItemsResponse>({
    statuses: statuses,
    bool: bool
  });
};
