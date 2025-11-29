import { UserDto } from "../../dto/UserDto";
import { FollowRequest } from "./FollowRequest";


export interface PagedUserItemRequest extends FollowRequest{
    readonly userAlias: string,
    readonly pageSize: number,
    readonly lastItem: UserDto | null
}