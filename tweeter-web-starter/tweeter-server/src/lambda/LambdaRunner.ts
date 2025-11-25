import { TweeterRequest, TweeterResponse, UserDto } from "tweeter-shared";
import { LambdaHelper } from "./LambdaHelper";
import { AbstractLambda } from "./AbstractLambda";
import { Service } from "../model/service/Service";

export class LambdaRunner {

    static async run<
        S extends Service,
        Req extends TweeterRequest,
        Res extends TweeterResponse
    >(
        LambdaClass: new (req: Req, user?: UserDto) => AbstractLambda<Req, S>, // constructor
        request: Req,
        serviceMethodName: keyof S,
        requiredFields: (keyof Req)[] = [],
        user: UserDto = { alias: "", firstName: "", lastName: "", imageUrl: "" },
        ...args: any[]
    ): Promise<Res> {

        // Validate required fields
        requiredFields.forEach(f => LambdaHelper.requireFields(request, f as string));

        // Create lambda instance
        const lambda = new LambdaClass(request, user);

        // Call service method
        const fn = lambda.service[serviceMethodName];
        if (typeof fn !== "function") throw new Error(`Service method '${String(serviceMethodName)}' does not exist`);

        const result = await fn.apply(lambda.service, args);

        return LambdaHelper.success<Res>(result);
    }
}


