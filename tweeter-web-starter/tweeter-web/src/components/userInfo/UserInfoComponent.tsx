import "./UserInfoComponent.css";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfoActions, useUserInfoContext } from "./UserHooks";
import { UserInfoPresenter, UserInfoView } from "../../presenters/UserInfoPresenter";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const {  displayErrorMessage, displayInfoMessage, deleteMessage } = useMessageActions();

  const { currentUser, authToken, displayedUser } = useUserInfoContext();
  const { setUser } = useUserInfoActions();
  const location = useLocation();
  const navigate = useNavigate();


  const view: UserInfoView = {
    setIsLoading: setIsLoading,
    displayErrorMessage: displayErrorMessage,
    displayInfoMessage: displayInfoMessage,
    deleteMessage: deleteMessage,
    setIsFollower: setIsFollower,
    setFollowerCount: setFollowerCount,
    setFolloweeCount: setFolloweeCount,
    
  }

  const presenterRef = useRef<UserInfoPresenter | null>(null);
    if (presenterRef.current === null) {
      presenterRef.current = new UserInfoPresenter(view);
    }

  // if (!displayedUser) {
  //   setUser(currentUser!);
  // }

  useEffect(() => {
    if (!displayedUser && currentUser) {
    setUser(currentUser);
  }
    console.log(authToken)
    console.log(currentUser)
    console.log(displayedUser)
    presenterRef.current!.setIsFollowerStatus(authToken!, currentUser!, displayedUser!);
    presenterRef.current!.setNumbFollowers(authToken!, displayedUser!);
    presenterRef.current!.setNumbFollowees(authToken!, displayedUser!);
    
  }, [displayedUser]);

  const switchToLoggedInUser = ( event: React.MouseEvent): void => {
    event.preventDefault();
    setUser(currentUser!);
    navigate(`${presenterRef.current!.getBaseUrl()}/${currentUser!.alias}`);
  };

  const followDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();

    presenterRef.current!.followDisplayedUser(authToken!, displayedUser!)
  };

  
  const unfollowDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();

    presenterRef.current!.unfollowDisplayedUser( displayedUser!, authToken!)
  };

  

  return (
    <>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {!displayedUser.equals(currentUser) && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={`./${currentUser.alias}`}
                    onClick={switchToLoggedInUser}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeeCount > -1 && followerCount > -1 && (
                <div>
                  Followees: {followeeCount} Followers: {followerCount}
                </div>
              )}
            </div>
            <form>
              {!displayedUser.equals(currentUser) && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={unfollowDisplayedUser}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Unfollow</div>
                      )}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={followDisplayedUser}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Follow</div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
