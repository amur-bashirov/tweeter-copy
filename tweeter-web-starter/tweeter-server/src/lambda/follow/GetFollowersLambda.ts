import { PagedUserItemRequest } from "tweeter-shared";


import { userHandler } from "./GetUsersHelper";

export const handler = async function(request: PagedUserItemRequest) {
  return userHandler(request, "loadMoreFollowers");
};
