import { AuthToken, TweeterResponse } from "tweeter-shared";

export class LambdaHelper {

  /** Validate auth token exists and return AuthToken instance */
  static requireToken(tokenDto: any): AuthToken {
    const token = AuthToken.fromDto(tokenDto ?? null);
    if (!token) {
      throw new Error("Missing auth token");
    }
    return token;
  }

  /** Validate that required fields are present */
  static requireFields(request: any, ...fields: string[]) {
    for (const field of fields) {
      if (request[field] === undefined || request[field] === null) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }

  /** Build a success response with correct shape */
  static success<RES extends TweeterResponse>(
    data: Omit<RES, "success" | "message">
  ): RES {
    return {
      success: true,
      message: null,
      ...data
    } as RES;
  }
}
