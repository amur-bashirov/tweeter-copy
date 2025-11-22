import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";


export interface CreateUserResponse extends TweeterResponse{
    readonly user: UserDto,
    readonly token: AuthTokenDto
}