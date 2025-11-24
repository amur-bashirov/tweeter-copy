import { StatusDto } from "../../dto/StatusDto";
import { TweeterResponse } from "./TweeterResponse";


export interface LoadMoreItemsResponse extends TweeterResponse{
    readonly statuses: StatusDto[],
    readonly bool: boolean
}