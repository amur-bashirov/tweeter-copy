import { AuthToken, User } from "tweeter-shared";

interface UseUserNavigationProps {
  authToken: AuthToken | null;
  displayedUser: User | null;
  setUser: (user: User) => void;
  featurePath: string;
}


export const useUserNavigation = () =>{

}