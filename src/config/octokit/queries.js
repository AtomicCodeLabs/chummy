export const formQueryGetRepositorySpecificBranchRootNodes = (
  branch,
  pathToFolder = ''
) => `
  query GetRepositorySpecificBranchRootNodes($owner: String!, $repo: String!) {
    repository(owner: $owner, name: $repo) {
      object(expression: "${branch}:${pathToFolder}") {
        ... on Tree {
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
`;

export const placeholder = 'placeholder';