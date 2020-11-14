import { useEffect, useState } from 'react';

import useFirebaseDAO from './firebase';
import { useUiStore, useUserStore } from './store';
import useDebounce from './useDebounce';

const DELAY = 1000; // in ms

const useBookmarkState = (bookmark, pendingSection = 'None') => {
  const firebase = useFirebaseDAO();
  const { addPendingRequest, removePendingRequest } = useUiStore();
  const { getUserBookmark } = useUserStore();

  // Local bookmarked state will only call request when it has
  // been left alone for more than 1s. This is to prevent expensive
  // requests if a user decides to toggle a file's bookmark multiple
  // times
  const [localBookmarked, _setLocalBookmarked] = useState(
    !!getUserBookmark(
      bookmark.repo.owner,
      bookmark.repo.name,
      bookmark.bookmarkId
    )
  );
  const setLocalBookmarked = async (newLocalBookmarked) => {
    addPendingRequest(pendingSection);
    _setLocalBookmarked(newLocalBookmarked);
  };
  useEffect(() => {
    // set pending to none
    // will be garbage collected after pending request is removed
    setTimeout(() => {
      removePendingRequest(pendingSection);
    }, DELAY);
  }, [localBookmarked]);

  const debouncedBookmarked = useDebounce(localBookmarked, DELAY);
  useEffect(() => {
    const addOrRemoveBookmark = async () => {
      const cachedBookmark = getUserBookmark(
        bookmark.repo.owner,
        bookmark.repo.name,
        bookmark.bookmarkId
      );

      if (
        (!cachedBookmark && debouncedBookmarked) || // If bookmarking changes status quo
        (cachedBookmark && !debouncedBookmarked) // If unbookmarking changes status quo
      ) {
        // Make request to add or remove bookmark
        const shouldChangeBookmarkState = debouncedBookmarked;
        if (shouldChangeBookmarkState) {
          // add bookmark
          firebase.addBookmark(bookmark);
        } else {
          // remove bookmark
          firebase.removeBookmark(bookmark);
        }
      }
      removePendingRequest(pendingSection);
    };
    addOrRemoveBookmark();
  }, [debouncedBookmarked]);

  return [localBookmarked, setLocalBookmarked];
};

export default useBookmarkState;
