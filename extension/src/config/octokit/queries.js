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

export const formSearchQuery = (
  owner,
  repo,
  queryFilename,
  queryCode,
  queryPath,
  language
) => {
  let baseQuery = `repo:${owner}/${repo}`;
  if (queryFilename) {
    baseQuery += `+filename:${queryFilename}`;
  }
  if (queryCode) {
    baseQuery += `+in:file+${queryCode}`;
  }
  if (queryPath) {
    baseQuery += `+path:${queryPath}`;
  }
  if (language) {
    baseQuery += `+language:${language}`;
  }
  console.log('BASE QUERY', baseQuery);
  return baseQuery;
};

export const placeholder = 'placeholder';
