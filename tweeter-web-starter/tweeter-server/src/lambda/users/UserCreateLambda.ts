
import { CreateUserRequest, CreateUserResponse } from "tweeter-shared";
import { UserLambda } from "./UserLambda";
import { LambdaHelper } from "../LambdaHelper";

export const handler = async (
  request: CreateUserRequest
): Promise<CreateUserResponse> => {

  const h = new UserLambda(request);

  const [userDto, tokenDto] = await h.service.register(
    request.firstName,
    request.lastName,
    h.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension
  );

  return LambdaHelper.success<CreateUserResponse>({
    user: userDto,
    token: tokenDto
  });
};
