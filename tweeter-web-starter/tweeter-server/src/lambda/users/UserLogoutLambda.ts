import {  TweeterRequest, TweeterResponse } from "tweeter-shared";
import { UserLambda } from "./UserLambda";

export const handler = async (request: TweeterRequest): Promise<TweeterResponse> => {
    return new UserLambda(request).run<TweeterRequest, TweeterResponse>(
        request,
        "logout",
        ["token"],
        request.token
    )
};