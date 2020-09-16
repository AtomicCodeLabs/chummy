export const formQueryGetRepositoryDefaultBranchRootNodes = () => `
defaultBranchRef {
  id
  target {
    ... on Commit {
      id
      history(first: 1) {
        nodes {
          tree {
            entries {
              name
              type
              path
              oid
            }
          }
        }
      }
    }
  }
}
`;

export const formQueryGetRepositorySpecificBranchRootNodes = (branch) => `
object(expression: "${branch}:") {
  ... on Tree {
    entries {
      name
      type
      path
      oid
    }
  }
}
`;
