/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      accountType
      metadata {
        cognitoUsername
        cognitoUserPoolId
        stripeId
      }
      owner
      onMailingList
      isTrial
      createdAt
      updatedAt
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
        }
        nextToken
      }
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        accountType
        metadata {
          cognitoUsername
          cognitoUserPoolId
          stripeId
        }
        owner
        onMailingList
        isTrial
        createdAt
        updatedAt
        bookmarks {
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getBookmark = /* GraphQL */ `
  query GetBookmark($id: ID!) {
    getBookmark(id: $id) {
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
    }
  }
`;
export const listBookmarks = /* GraphQL */ `
  query ListBookmarks(
    $filter: ModelBookmarkFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBookmarks(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
      }
      nextToken
    }
  }
`;
