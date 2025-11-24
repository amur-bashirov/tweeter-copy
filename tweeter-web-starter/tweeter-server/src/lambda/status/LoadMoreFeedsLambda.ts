import { LoadMoreItemRequest, LoadMoreItemsResponse } from "tweeter-shared";
import { itemsHandler } from "./LoadMoreItemsHelper";




export const handler = async(request: LoadMoreItemRequest): Promise<LoadMoreItemsResponse> => {
    return itemsHandler(request, "loadMoreFeedItems");
}