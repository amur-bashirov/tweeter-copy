import { LoginRequest } from "./LoginRequest";


export interface CreateUserRequest extends LoginRequest{
    readonly firstName: string,
    readonly lastName: string,
    readonly userImageBytes: Uint8Array,
    readonly imageFileExtension: string
}