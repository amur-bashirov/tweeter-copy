import {  TweeterRequest, TweeterResponse } from "tweeter-shared";
import { LambdaHelper } from "../LambdaHelper";
import { UserLambda } from "./UserLambda";
import { LambdaRunner } from "../LambdaRunner";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: TweeterRequest): Promise<TweeterResponse> => {

    return LambdaRunner.run<UserService, TweeterRequest, TweeterResponse>(
        UserLambda,
        request,
        "logout",
        ["token"],
        undefined,
        request.token
    )
};