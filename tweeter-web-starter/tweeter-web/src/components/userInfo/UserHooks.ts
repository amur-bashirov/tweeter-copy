import { useContext } from "react";
import { UserInfoActionsContext } from "./UserInfoContexts";
import { AuthToken, User } from "tweeter-shared";

interface UserActions{
    updateUser: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
      ) => void,
      clearUser: () => void,
        setUser: (user: User) => void,
}

export const useUserInfoActions =(): UserActions =>{
    const { updateUserInfo, clearUserInfo, setDisplayedUser } = useContext(UserInfoActionsContext);
    return{
        updateUser: updateUserInfo,
        clearUser: clearUserInfo,
        setUser: setDisplayedUser

    }
}