export const bookmarkRepoMapToArray = (repoMap) =>
  Object.values(repoMap).flat();

export const transformBookmarks = (bookmarks) => {
  // <key: {owner:repo}, value: Repo>
  // eslint-disable-next-line prefer-const
  let userBookmarks = {};
  bookmarks.forEach((b) => {
    const repoKey = `${b.repo.owner}:${b.repo.name}`;
    const foundRepo = userBookmarks[repoKey];
    if (!foundRepo) {
      // If not found, create entry
      userBookmarks[repoKey] = {
        owner: b.repo.owner,
        name: b.repo.name,
        bookmarks: [b]
      };
    } else {
      // Add to existing repo
      userBookmarks[repoKey] = {
        ...foundRepo,
        bookmarks: [...foundRepo.bookmarks, b]
      };
    }
  });
  return userBookmarks;
};

export const PLACEHOLDER = '';
