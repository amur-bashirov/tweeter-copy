import { add } from "./AbstractHandler"


export const handler = async (event: any) => {
    await add(event);
}