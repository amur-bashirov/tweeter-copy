import {
  PagedUserItemRequest,
  PagedUserItemResponse,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "TODO: Set this value.";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  private convertUsers(response: any): User[] | null{
    return response.success && response.items
      ? response.items.map((dto: UserDto) => User.fromDto(dto) as User)
      : null;
  }

  private catchErrors( response: any, message: string, ...args: any[]) {
    if (response.success) {
      for (const arg of args) {
        if (arg === null || arg === undefined) {
          throw new Error(message);
        }
      }     
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  private async getMoreUsers(request: PagedUserItemRequest, path: string, message: string): Promise<[User[], boolean]>{
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, path);

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items = this.convertUsers(response);
    // Handle errors
    this.catchErrors(response, message, items)
    return [items!, response.hasMore];
  }

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    return this.getMoreUsers(request, "/followees", `No followees found`)
  }


    public async getMoreFollowers(
      request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
          return this.getMoreUsers(request, "/followers", `No followers found`)
    }
}