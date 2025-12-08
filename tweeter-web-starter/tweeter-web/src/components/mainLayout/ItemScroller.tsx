import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfoActions, useUserInfoContext } from "../userInfo/UserHooks";
import { PageItemPresenter, PageItemView } from "../../presenters/PageItemPresenter";
import { Presenter } from "../../presenters/Presenter";
import { Service } from "../../model.service/Service";
import { Status, User } from "tweeter-shared";

interface Props<T, S extends Service, U extends Presenter<PageItemView<T>>> {
  featureURL: string;
  presenterFactory: (listener: PageItemView<T>) => U;
  itemComponentFactory: (item: T, feature: string) => JSX.Element;
}

function ItemScroller<
  T extends User | Status,
  S extends Service,
  U extends PageItemPresenter<T, S>
>(props: Props<T, S, U>) {
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<T[]>([]);

  const { displayedUser, authToken } = useUserInfoContext();
  const { setUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const listener: PageItemView<T> = {
    addItems: (newItems: T[]) =>
      setItems((prev) => [...prev, ...newItems]),
    displayErrorMessage
  };

  const presenterRef = useRef<U | null>(null);

  // ✅ FIX #1: make sure presenter rebuilds when URL changes
  useEffect(() => {
    presenterRef.current = props.presenterFactory(listener);

    setItems([]);
    presenterRef.current.reset();

    if (authToken && displayedUser) {
      presenterRef.current.loadMoreItems(
        authToken,
        displayedUser.alias
      );
    }
  }, [props.featureURL, displayedUser]);

  // ✅ FIX #2: keep presenter in sync when URL param changes
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUser &&
      displayedUserAliasParam !== displayedUser.alias
    ) {
      presenterRef.current
        ?.getUser(authToken, displayedUserAliasParam)
        .then((toUser) => {
          if (toUser) {
            setUser(toUser);
          }
        });
    }
  }, [displayedUserAliasParam]);

  const loadMoreItems = async () => {
    if (!authToken || !displayedUser) return;
    presenterRef.current?.loadMoreItems(
      authToken,
      displayedUser.alias
    );
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenterRef.current?.hasMoreItems ?? false}
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
