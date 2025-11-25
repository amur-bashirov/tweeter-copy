
import { TweeterRequest } from "tweeter-shared";
import { LambdaHelper } from "./LambdaHelper";
import { Service } from "../model/service/Service";

export abstract class AbstractLambda<
  T extends TweeterRequest,
  S extends Service
> {
  public readonly request: T;
  public readonly service: S;

  constructor(
    request: T,
    serviceCtor: new () => S,
    requiredFields: string[] = []
  ) {
    this.request = request;
    this.service = new serviceCtor();


    for (const field of requiredFields) {
      LambdaHelper.requireFields(request, field);
    }
  }
}
