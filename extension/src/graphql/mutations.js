/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const cancelSubscription = /* GraphQL */ `
  mutation CancelSubscription {
    cancelSubscription {
      id
    }
  }
`;
export const syncUser = /* GraphQL */ `
  mutation SyncUser {
    syncUser {
      id
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createBookmark = /* GraphQL */ `
  mutation CreateBookmark(
    $input: CreateBookmarkInput!
    $condition: ModelBookmarkConditionInput
  ) {
    createBookmark(input: $input, condition: $condition) {
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
export const updateBookmark = /* GraphQL */ `
  mutation UpdateBookmark(
    $input: UpdateBookmarkInput!
    $condition: ModelBookmarkConditionInput
  ) {
    updateBookmark(input: $input, condition: $condition) {
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
export const deleteBookmark = /* GraphQL */ `
  mutation DeleteBookmark(
    $input: DeleteBookmarkInput!
    $condition: ModelBookmarkConditionInput
  ) {
    deleteBookmark(input: $input, condition: $condition) {
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
