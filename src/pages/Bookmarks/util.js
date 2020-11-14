import { useMemo, useState } from 'react';
import { QuickScore } from 'quick-score';
import { isBlank } from '../../utils';

export const useSearchableBookmarks = (
  userBookmarks,
  numOfBookmarks,
  repository
) => {
  const [bookmarkRepoResults, setBookmarkRepoResults] = useState({});
  const searchBookmarksHandler = useMemo(() => {
    const userBookmarksSubTree =
      isBlank(repository) || !userBookmarks.has(repository)
        ? // Search all repos
          Array.from(userBookmarks)
            .map(([, repo]) => Object.values(repo.bookmarks))
            .flat()
        : // Search one repo
          Object.values(userBookmarks.get(repository).bookmarks);
    return new QuickScore(
      userBookmarksSubTree.map(
        ({
          bookmarkId,
          branch: { name: branchName },
          name,
          path,
          repo: { owner: repoOwner, name: repoName }
        }) => ({
          bookmarkId,
          branchName,
          name,
          path,
          repoOwner,
          repoName
        })
      ),
      ['branchName', 'name', 'path']
    );
  }, [numOfBookmarks, repository]);

  const searchBookmarks = (query) =>
    new Promise((resolve) => {
      const results = searchBookmarksHandler.search(query);
      // Restructure search results into map of map to make it easier to pass down with
      // userBookmarksRepo
      // eslint-disable-next-line prefer-const
      let bookmarkRepos = {};
      results.forEach(({ item, matches }) => {
        const repoKey = `${item.repoOwner}:${item.repoName}`;
        const bookmarkInfo = {
          matches
        };
        const foundRepo = bookmarkRepos[repoKey];
        if (foundRepo) {
          bookmarkRepos[repoKey][item.bookmarkId] = bookmarkInfo;
        } else {
          bookmarkRepos[repoKey] = {
            [item.bookmarkId]: bookmarkInfo
          };
        }
      });
      setBookmarkRepoResults(bookmarkRepos);
      resolve();
    });

  return { bookmarkRepoResults, searchBookmarks };
};

export const getBookmarkResultsDescription = (bookmarkRepoResults) => {
  const bookmarksValues = Object.values(bookmarkRepoResults);

  if (!bookmarksValues.length) {
    return 'No bookmarks found';
  }

  const numBookmarks = bookmarksValues.reduce(
    (_numBookmarks, bookmarks) => _numBookmarks + Object.keys(bookmarks).length,
    0
  );

  return `${numBookmarks} bookmarks in ${bookmarksValues.length} ${
    bookmarksValues.length !== 1 ? 'repos' : 'repo'
  }`;
};
