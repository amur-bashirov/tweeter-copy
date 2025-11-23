import { TweeterResponse } from "./TweeterResponse";

export interface FollowCountResponse extends TweeterResponse{
    readonly number: number;
}