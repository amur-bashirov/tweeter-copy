import { UserRequest } from "./UserRequest";


export interface LoginRequest extends UserRequest{
    readonly password: string
}