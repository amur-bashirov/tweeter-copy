import {  TweeterRequest, TweeterResponse } from "tweeter-shared";
import { LambdaHelper } from "../LambdaHelper";
import { UserLambda } from "./UserLambda";

export const handler = async (request: TweeterRequest): Promise<TweeterResponse> => {

    const h = new UserLambda(request);

    await h.service.logout(h.token!);

    return LambdaHelper.success({});
};