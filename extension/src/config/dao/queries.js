/* eslint-disable import/prefer-default-export */
export const getUserBookmarks = /* GraphQL */ `
  query GetUserBookmarks($userId: ID!) {
    getUser(id: $userId) {
      bookmarks {
        items {
          id
          userId
          name
          path
          pinned
          branch
          repo
          owner
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
    }
  }
`;
