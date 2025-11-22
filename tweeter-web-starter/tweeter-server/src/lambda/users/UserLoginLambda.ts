import {  LoginRequest, CreateUserResponse } from "tweeter-shared";
import { LambdaHelper } from "../LambdaHelper";
import { UserLambda } from "./UserLambda";

export const handler = async (request: LoginRequest): Promise<CreateUserResponse> => {

    const h = new UserLambda(request); 

    const [userDto, tokenDto] = await h.service.login(h.alias!, request.password);

    return LambdaHelper.success<CreateUserResponse>({
        user: userDto,
        token: tokenDto
    });
};