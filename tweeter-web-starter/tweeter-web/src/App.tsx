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
import UserItemScroller from "./components/mainLayout/ItemScroller";
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import { useUserInfoContext } from "./components/userInfo/UserHooks";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import { StoryPresenter } from "./presenters/StoryPresenter";
import { FeedPresenter } from "./presenters/FeedPresenter";
import { Status, User } from "tweeter-shared";
import { PageItemPresenter, PageItemView } from "./presenters/PageItemPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import UserItem from "./components/userItem/UserItem";
import { FollowService } from "./model.service/FollowService";
import StatusItem from "./components/statusItem/statusItem";
import { StatusService } from "./model.service/StatusService";

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

  const itemComponentFactory = (item: User | Status, featureURL: string) => {
    if (item instanceof Status){
      return (<StatusItem
      status={item}
     // user={item.user}
      //formattedDate={item.formattedDate}
      featurePath={featureURL}
      />)
    }
    return <UserItem user={item} featurePath={featureURL}/>

  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        <Route
         path="feed/:displayedUser" 
         element={
         <ItemScroller<Status, StatusService, PageItemPresenter<Status,StatusService>>
          key ={displayedUser!.alias}
         presenterFactory={(view: PageItemView<Status>) => new FeedPresenter(view)} 
         featureURL="/feed" 
         itemComponentFactory={itemComponentFactory}
          
          />
          }
          />
        <Route 
        path="story/:displayedUser"
         element={
         <ItemScroller<Status, StatusService, PageItemPresenter<Status,StatusService>>
          key ={displayedUser!.alias}
         presenterFactory={(view: PageItemView<Status>) => new StoryPresenter(view)} 
         featureURL="/story" 
         itemComponentFactory={itemComponentFactory}
         />}
          />
        <Route
         path="followees/:displayedUser" 
         element={
         <ItemScroller<User, FollowService, PageItemPresenter<User,FollowService>>
          key ={displayedUser!.alias}
         presenterFactory={(view: PageItemView<User>) => new FolloweePresenter(view)} 
         featureURL="/folowees" 
         itemComponentFactory={itemComponentFactory}

                  />}
               />
        <Route 
        path="followers/:displayedUser"
         element={
         <ItemScroller<User, FollowService, PageItemPresenter<User,FollowService>>
          key ={displayedUser!.alias}
         presenterFactory={(view: PageItemView<User>) => new FollowerPresenter(view)} 
         featureURL="/folowers" 
         itemComponentFactory={itemComponentFactory}
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
