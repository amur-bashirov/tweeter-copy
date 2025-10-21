import { Status } from "tweeter-shared";
import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {  useParams } from "react-router-dom";
import StatusItem from "../statusItem/statusItem";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfoActions, useUserInfoContext } from "../userInfo/UserHooks";
import {  StatusItemPresenter } from "../../presenters/StatusItemPresenter";
import { PageItemView } from "../../presenters/PageItemPresenter";




interface Props{
  featureURL: string;
  presenterFactory: (listener: PageItemView<Status>) => StatusItemPresenter
}

const StatusItemScroller = (props: Props) =>{
  const {  displayErrorMessage } = useMessageActions()
  const [items, setItems] = useState<Status[]>([]);
  
  const listener: PageItemView<Status> = {
    addItems : (newItems: Status[]) => setItems((previousItems) => [...previousItems, ...newItems]),
    displayErrorMessage: displayErrorMessage
  }


  const presenterRef = useRef<StatusItemPresenter | null>(null)
    if (!presenterRef.current){
      presenterRef.current = props.presenterFactory(listener);
    }
  

  

  const { displayedUser, authToken } = useUserInfoContext();
  const { setUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  // Update the displayed user context variable whenever the displayedUser url parameter changes. This allows browser forward and back buttons to work correctly.
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam != displayedUser!.alias
    ) {
      presenterRef.current!.getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
        if (toUser) {
          setUser(toUser);
        }
      });
    }
  }, [displayedUserAliasParam]);

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
    loadMoreItems();
  }, [displayedUser]);

  const reset = async () => {
    setItems(() => []);
    presenterRef.current!.reset()
  };

  const loadMoreItems = async () => {
    presenterRef.current!.loadMoreItems(authToken!, displayedUser!.alias);
  };

  

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenterRef.current!.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <StatusItem status={item} featurePath={props.featureURL} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default StatusItemScroller