import {  TweeterRequest, TweeterResponse } from "tweeter-shared";
import { LambdaHelper } from "../LambdaHelper";
import { UserLambda } from "./UserLambda";

export const handler = async (request: TweeterRequest): Promise<TweeterResponse> => {

    const h = new UserLambda(request);
    LambdaHelper.requireFields(request, "token");

    await h.service.logout(request.token!);

    return LambdaHelper.success({});
};