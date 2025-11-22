
import { UserRequest, GetUserResponse, AuthToken } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";


const handler = async(request: UserRequest): Promise<GetUserResponse> => {

  
    const userService = new UserService();
    const token = AuthToken.fromDto(request.token ?? null);
    if (!token) {
        throw new Error("Missing auth token");
    }
    if (!request || !request.alias) {
        throw new Error("Missing alias in request");
    }
  
    const userDto = await userService.getUser(token, request.alias);

    

    return {
        success: true,
        message: null,
        user: userDto
    };
}