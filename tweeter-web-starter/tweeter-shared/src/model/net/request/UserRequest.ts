import { TweeterRequest } from "./TweeterRequest";

export interface UserRequest extends TweeterRequest{
    alias?: string | null;
}