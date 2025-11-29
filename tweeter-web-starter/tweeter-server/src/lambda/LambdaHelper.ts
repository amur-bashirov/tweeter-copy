import { TweeterResponse } from "tweeter-shared";

export class LambdaHelper {

  /** Validate that required fields are present */
  static requireFields(request: any, ...fields: string[]) {
    for (const field of fields) {
      if (request[field] === undefined ) {
        throw new Error(`Missing required field: ${field}`);
      }
      return request[field]
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
