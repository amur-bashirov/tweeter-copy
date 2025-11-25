
import { CreateUserRequest, CreateUserResponse } from "tweeter-shared";
import { UserLambda } from "./UserLambda";




export const handler = async (
  request: CreateUserRequest
): Promise<CreateUserResponse> => {
    return new UserLambda(request).run<CreateUserRequest, CreateUserResponse>(
    request,
    "register",
    [],
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension
    )
    
    
}