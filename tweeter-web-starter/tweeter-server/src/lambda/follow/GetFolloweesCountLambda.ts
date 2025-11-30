import {  FollowRequest, getFolloweeCountResponse } from "tweeter-shared";

import { userHandler } from "./GetCount";


export const handler = async(request: FollowRequest): Promise<getFolloweeCountResponse> => {
    return userHandler<getFolloweeCountResponse>(request, "getFolloweeCount");
}