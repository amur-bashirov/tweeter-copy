import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusLambdaHelper } from "./StatusLambdaHelper";
import { LambdaHelper } from "../LambdaHelper";



export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
    const h = new StatusLambdaHelper(request);
    h.service.postStatus(h.token!, request.newStatus)
    return LambdaHelper.success({});
}