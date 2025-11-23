import { FollowCountResponse, FollowRequest } from "tweeter-shared";

import { userHandler } from "./GetCount";


export const handler = async(request: FollowRequest): Promise<FollowCountResponse> => {
    return userHandler(request, "getFollowerCount");
}