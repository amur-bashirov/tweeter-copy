
import { CreateUserRequest, CreateUserResponse } from "tweeter-shared";
import { UserLambda } from "./UserLambda";
import { LambdaRunner } from "../LambdaRunner";
import { UserService } from "../../model/service/UserService";




export const handler = async (
  request: CreateUserRequest
): Promise<CreateUserResponse> => {
  return LambdaRunner.run<UserService, CreateUserRequest, CreateUserResponse>(
    UserLambda,
    request,
    "register",
    [],
    undefined,
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension
  )
    
    
}