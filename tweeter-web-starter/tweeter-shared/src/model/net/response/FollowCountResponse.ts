import { FollowResponse } from "./FollowResponse";

export interface FollowCountResponse extends FollowResponse{
    readonly number: number;
}