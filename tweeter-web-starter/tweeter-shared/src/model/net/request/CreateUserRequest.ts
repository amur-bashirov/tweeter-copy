import { UserRequest } from "./UserRequest";


export interface CreateUserRequest extends UserRequest{
    readonly firstName: string,
    readonly lastName: string,
    readonly password: string,
    readonly userImageBytes: Uint8Array,
    readonly imageFileExtension: string
}