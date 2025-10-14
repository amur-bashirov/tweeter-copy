import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfoActions, useUserInfoContext } from "../userInfo/UserHooks";
import { UserNavigationHooksPresenter, UserNavigationHooksView } from "../../presenters/UserNevigationHooksPresenter";
import { useRef } from "react";



export const useUserNavigation = () =>{
  const {  displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfoContext();
  const { setUser } = useUserInfoActions();

  

  const view: UserNavigationHooksView = {
    displayErrorMessage: displayErrorMessage,
    setUser: setUser,
    extractAlias : (value: string): string => { const index = value.indexOf("@"); return value.substring(index);}

}

const presenterRef = useRef<UserNavigationHooksPresenter | null>(null);
    if (!presenterRef.current) {
      presenterRef.current = new UserNavigationHooksPresenter(view);
    }

  const navigateToUser = async (event: React.MouseEvent, featurePath : string): Promise<void> => {
    event.preventDefault();
    const alias = event.target.toString()

    presenterRef.current!.navigateToUser(alias, featurePath, authToken!, displayedUser!)
  };

  return { navigateToUser };
}