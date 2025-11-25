
import { UserRequest, GetUserResponse } from "tweeter-shared";
import { UserLambda } from "./UserLambda";

export const handler = async (request: UserRequest): Promise<GetUserResponse> => {
    return new UserLambda(request).run<UserRequest,GetUserResponse>(
    request,
    "getUser",
    ["token"],
    request.token,
    request.alias
    )

};