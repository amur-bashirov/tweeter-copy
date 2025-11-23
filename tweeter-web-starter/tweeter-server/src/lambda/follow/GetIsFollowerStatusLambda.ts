import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse } from "tweeter-shared";
import { FollowLambda } from "./FollowLambdaHelper";
import { LambdaHelper } from "../LambdaHelper";


export const hanlder = async(request: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> => {
    const h = new FollowLambda(request, request.user!)
    LambdaHelper.requireFields(request, "selectedUser")
    const status = await h.service.getIsFollowerStatus(h.token!, h.user, request.selectedUser!);
    return LambdaHelper.success<GetIsFollowerStatusResponse>({
        status: status
    })
}