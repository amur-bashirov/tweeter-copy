import { StatusDto } from "../../dto/StatusDto";
import { TweeterRequest } from "./TweeterRequest";


export interface LoadMoreItemRequest extends TweeterRequest{
    readonly userAlias: string,
    readonly pageSize: number,
    readonly lastItem: StatusDto | null,
}