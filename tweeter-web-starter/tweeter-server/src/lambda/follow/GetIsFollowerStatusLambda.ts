import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse } from "tweeter-shared";
import { FollowLambda } from "./FollowLambdaHelper";

export const handler = async (
  request: GetIsFollowerStatusRequest
): Promise<GetIsFollowerStatusResponse> => {

    return new FollowLambda(request, request.user!).run<GetIsFollowerStatusRequest, GetIsFollowerStatusResponse>(
        request,
        "getIsFollowerStatus",
        ["selectedUser"],   
        request.token!,
        request.user!,
        request.selectedUser!       
    )
};
