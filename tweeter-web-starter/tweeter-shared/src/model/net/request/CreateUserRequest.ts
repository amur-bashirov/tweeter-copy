import { LoginRequest } from "./LoginRequest";


export interface CreateUserRequest extends LoginRequest{
    readonly firstName: string,
    readonly lastName: string,
    readonly userImageBytes: string,
    readonly imageFileExtension: string
}