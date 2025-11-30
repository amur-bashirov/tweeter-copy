import { FollowCountResponse } from "./FollowCountResponse";



export interface getFolloweeCountResponse extends FollowCountResponse{
    readonly followeeCount: number
}