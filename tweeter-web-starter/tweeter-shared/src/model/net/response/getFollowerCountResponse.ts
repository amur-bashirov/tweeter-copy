import { FollowCountResponse } from "./FollowCountResponse";



export interface getFollowerCountResponse extends FollowCountResponse{
    readonly followerCount: number
}