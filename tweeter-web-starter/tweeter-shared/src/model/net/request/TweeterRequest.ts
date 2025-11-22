import { AuthTokenDto } from "../../dto/AuthTokenDto";

export interface TweeterRequest {
  token?: AuthTokenDto | null;
}

