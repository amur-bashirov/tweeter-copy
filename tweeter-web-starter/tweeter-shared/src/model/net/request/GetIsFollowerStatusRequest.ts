import { UserDto } from "../../dto/UserDto";
import { FollowRequest } from "./FollowRequest";

export interface GetIsFollowerStatusRequest extends FollowRequest{
    readonly selectedUser: UserDto | null
}