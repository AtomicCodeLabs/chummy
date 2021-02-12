/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
      createdAt
      updatedAt
      owner
      bookmarks {
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
      createdAt
      updatedAt
      owner
      bookmarks {
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
      createdAt
      updatedAt
      owner
      bookmarks {
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
      createdAt
      updatedAt
      owner
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
      createdAt
      updatedAt
      owner
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
      createdAt
      updatedAt
      owner
    }
  }
`;
