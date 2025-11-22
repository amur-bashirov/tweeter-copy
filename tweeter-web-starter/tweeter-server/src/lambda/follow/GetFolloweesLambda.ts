import { PagedUserItemRequest } from "tweeter-shared";
import { userHandler } from "./GetUsers";

export const handler = async function(request: PagedUserItemRequest) {
  return userHandler(request, "loadMoreFollowees");
};