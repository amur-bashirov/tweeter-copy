import { AuthTokenDto } from "../../dto/AuthTokenDto";

export interface TweeterRequest {
  readonly token?: AuthTokenDto | null;
}

