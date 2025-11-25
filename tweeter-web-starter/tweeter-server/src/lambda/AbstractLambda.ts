
import { TweeterRequest, TweeterResponse } from "tweeter-shared";
import { LambdaHelper } from "./LambdaHelper";
import { Service } from "../model/service/Service";

export abstract class AbstractLambda<T extends TweeterRequest, S extends Service> {
  public readonly request: T;
  public readonly service: S;

  constructor(request: T, serviceCtor: new () => S, requiredFields: (keyof T)[] = []) {
    this.request = request;
    this.service = new serviceCtor();

    // Validate required fields
    this.requreFileds<T>(request, requiredFields)
    for (const field of requiredFields) {
      LambdaHelper.requireFields(request, field as string);
    }
  }

  /**
   * Call a method on the service, with optional arguments, and automatically wrap in TweeterResponse
   */
  async run<T extends TweeterRequest, R extends TweeterResponse>(
    request: T,
    methodName: keyof S,
    requiredFields: (keyof T)[] = [],
    ...args: any[]
  ): Promise<R> {
    const fn = this.service[methodName];
    if (typeof fn !== "function") {
      throw new Error(`Service method '${String(methodName)}' does not exist`);
    }
    this.requreFileds<T>(request, requiredFields)
    this.requreFileds<T>(request, args)

    const result = await fn.apply(this.service, args);

    return LambdaHelper.success<R>(result);
  }

  private requreFileds<R extends TweeterRequest>(request:R, ...args: any[]){
    for (const arg of args) {
    LambdaHelper.requireFields(request, arg as string);
    }    
  }
}

