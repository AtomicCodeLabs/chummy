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

exports.updateUser = updateUser;
