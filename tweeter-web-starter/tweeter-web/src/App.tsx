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
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import { useUserInfoContext } from "./components/userInfo/UserHooks";
import { UserItemView } from "./presenters/UserItemPresenter";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import { StoryPresenter } from "./presenters/StoryPresenter";
import { StatusItemView } from "./presenters/StatusItemPresenter";
import { FeedPresenter } from "./presenters/FeedPresenter";

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

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        <Route
         path="feed/:displayedUser" 
         element={<StatusItemScroller
              key ={displayedUser!.alias}
              presenterFactory={(view: StatusItemView) => new FeedPresenter(view)}
              featureURL="/feed" 
              />}
               />
        <Route 
        path="story/:displayedUser"
         element={<StatusItemScroller 
         key ={displayedUser!.alias}
         presenterFactory={(view: StatusItemView) => new StoryPresenter(view)} 
         featureURL="/story" 
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
