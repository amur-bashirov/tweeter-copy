import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import { useUserInfoContext } from "./components/userInfo/UserHooks";
import { UserItemView } from "./presenters/UserItemPresenter";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";

const App = () => {
  const { currentUser, authToken } = useUserInfoContext();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfoContext();

  

  const loadMoreFeedItems = async (
      authToken: AuthToken,
      userAlias: string,
      pageSize: number,
      lastItem: Status | null
    ): Promise<[Status[], boolean]> => {
      // TODO: Replace with the result of calling server
      return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
    };

    const loadMoreStoryItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        <Route
         path="feed/:displayedUser" 
         element={<StatusItemScroller
              key ={displayedUser!.alias}
              itemDescription="feed" 
              featureURL="/feed" 
              loadMoreFeedsStories={loadMoreFeedItems} 
              />}
               />
        <Route 
        path="story/:displayedUser"
         element={<StatusItemScroller 
         key ={displayedUser!.alias}
         itemDescription="story" 
         featureURL="/story" 
         loadMoreFeedsStories={loadMoreStoryItems}  
         />}
          />
        <Route
         path="followees/:displayedUser" 
         element={<UserItemScroller
              key ={displayedUser!.alias}
              featureURL="/folowees" 
              presenterFactory={(view: UserItemView) => new FolloweePresenter(view)}
              />}
               />
        <Route 
        path="followers/:displayedUser"
         element={<UserItemScroller 
         key ={displayedUser!.alias} 
         featureURL="/folowees" 
         presenterFactory={(view: UserItemView) => new FollowerPresenter(view)}
         />}
          /> 
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
