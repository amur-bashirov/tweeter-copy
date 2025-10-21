import { useState, useEffect, useRef, ComponentType } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import UserItem from "../userItem/UserItem";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfoActions, useUserInfoContext } from "../userInfo/UserHooks";
import { PageItemPresenter, PageItemView } from "../../presenters/PageItemPresenter";
import { Presenter } from "../../presenters/Presenter";
import { Service } from "../../model.service/Service";
import { Status, User } from "tweeter-shared";


interface Props<T, S extends Service, U extends Presenter<PageItemView<T>>> {
  featureURL: string;
  presenterFactory: (listener: PageItemView<T>) => U;
  itemComponentFactory: (item: T, feature:string) => JSX.Element;
 
}

function ItemScroller<T extends User | Status, S extends Service, U extends PageItemPresenter<T, S> >(props: Props<T,S, U>){
  const {  displayErrorMessage } = useMessageActions()
  const [items, setItems] = useState<T[]>([]);

  

  

  const { displayedUser, authToken } = useUserInfoContext();``
  const { setUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const listener: PageItemView<T> = {
    addItems: (newItems: T[]) => setItems((previousItems) => [...previousItems, ...newItems]),
    displayErrorMessage: displayErrorMessage
  }

  const presenterRef = useRef<U | null>(null)
  if (!presenterRef.current){`1`
    presenterRef.current = props.presenterFactory(listener);
  }
  
  

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
    presenterRef.current!.reset();
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
            {props.itemComponentFactory(item, props.featureURL)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default ItemScroller;