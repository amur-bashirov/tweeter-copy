import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowLambda } from "./FollowLambdaHelper";
import { LambdaRunner } from "../LambdaRunner";
import { FollowService } from "../../model/service/FollowService";

export const userHandler = async (
  request: PagedUserItemRequest,
  method: "loadMoreFollowers" | "loadMoreFollowees"
): Promise<PagedUserItemResponse> => {

  return LambdaRunner.run<FollowService, PagedUserItemRequest, PagedUserItemResponse>(
    FollowLambda,
    request,
    method,
    [],                 
    request.user!,
    request.token!,
    request.userAlias,
    request.pageSize,
    request.user
  );
};

