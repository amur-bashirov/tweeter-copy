import { add } from "./AbstractHandler"


export const handler = async (event: any) => {
      console.log(">>> Lambda triggered");
  console.log("Records:", event.Records?.length);

  try {
    await add(event);
    console.log(">>> Batch processed successfully");
  } catch (e) {
    console.error(">>> Batch failed", e);
    throw e;
  }
}