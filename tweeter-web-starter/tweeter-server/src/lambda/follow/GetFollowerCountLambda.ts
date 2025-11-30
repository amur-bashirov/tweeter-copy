import {  FollowRequest, getFollowerCountResponse } from "tweeter-shared";

import { userHandler } from "./GetCount";


export const handler = async(request: FollowRequest): Promise<getFollowerCountResponse> => {
    return userHandler<getFollowerCountResponse>(request, "getFollowerCount");
}