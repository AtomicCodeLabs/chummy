const getUser = `query getUser($id: ID!) {
    getUser(id: $id) {
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
        items {
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
    }
  }
`;

const createUser = `mutation createUser(
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
        items {
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
        nextToken
      }
    }
  }
`;

const updateUser = `mutation updateUser(
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
        items {
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
        nextToken
      }
    }
  }
`;

exports.getUser = getUser;
exports.createUser = createUser;
exports.updateUser = updateUser;
