import {  LoginRequest, CreateUserResponse } from "tweeter-shared";
import { UserLambda } from "./UserLambda";

export const handler = async (request: LoginRequest): Promise<CreateUserResponse> => {
    return new UserLambda(request).run<LoginRequest,  CreateUserResponse>(
        request,
        "login",
        [],
        request.alias,
        request.password
    )
};