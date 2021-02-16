export const cancelSubscription = /* GraphQL */ `
  mutation CancelSubscription($ddbId: String!) {
    cancelSubscription(ddbId: $ddbId) {
      id
    }
  }
`;

export const syncUser = /* GraphQL */ `
  mutation SyncUser($ddbId: String!) {
    syncUser(ddbId: $ddbId) {
      id
    }
  }
`;
