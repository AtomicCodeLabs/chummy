/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($owner: String) {
    onCreateUser(owner: $owner) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($owner: String) {
    onUpdateUser(owner: $owner) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($owner: String) {
    onDeleteUser(owner: $owner) {
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
export const onCreateBookmark = /* GraphQL */ `
  subscription OnCreateBookmark($owner: String) {
    onCreateBookmark(owner: $owner) {
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
export const onUpdateBookmark = /* GraphQL */ `
  subscription OnUpdateBookmark($owner: String) {
    onUpdateBookmark(owner: $owner) {
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
export const onDeleteBookmark = /* GraphQL */ `
  subscription OnDeleteBookmark($owner: String) {
    onDeleteBookmark(owner: $owner) {
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
