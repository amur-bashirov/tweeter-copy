import {  LoginRequest, CreateUserResponse } from "tweeter-shared";
import { UserLambda } from "./UserLambda";
import { LambdaRunner } from "../LambdaRunner";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: LoginRequest): Promise<CreateUserResponse> => {

    return LambdaRunner.run<UserService,LoginRequest,  CreateUserResponse>(
        UserLambda,
        request,
        "login",
        [],
        undefined,
        request.alias,
        request.password
    )
};