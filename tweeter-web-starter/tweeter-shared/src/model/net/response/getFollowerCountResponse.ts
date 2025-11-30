import { FollowCountResponse } from "./FollowCountResponse";



export interface getFollowerCountResponse extends FollowCountResponse{
    readonly followeeCount: number
}