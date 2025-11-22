
import { AuthToken, CreateUserRequest, CreateUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";


export const handler = async(request: CreateUserRequest): Promise<CreateUserResponse> => {

  
    const userService = new UserService();
    const token = AuthToken.fromDto(request.token ?? null);
    if (!token) {
        throw new Error("Missing auth token");
    }
    if (!request || !request.alias) {
        throw new Error("Missing alias in request");
    }
  
    const [userDto, authTokenDto] = await userService.register(request.firstName,request.lastName,
         request.alias,request.password, request.userImageBytes, request.imageFileExtension);

    

    return {
        success: true,
        message: null,
        user: userDto,
        token: authTokenDto
    };
}