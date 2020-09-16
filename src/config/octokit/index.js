import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { graphql } from '@octokit/graphql';

import {
  formQueryGetRepositoryDefaultBranchRootNodes,
  formQueryGetRepositorySpecificBranchRootNodes
} from './queries';

let isInitialized = false;

class OctoDAO {
  constructor(store) {
    isInitialized = true;
    this.userStore = store.userStore; // mobx
    this.fileStore = store.fileStore;

    this.graphql = graphql;
    this.graphqlAuth = null;
  }

  // Auth API (Config with auth)

  authenticate = (apiKey) => {
    console.log('auth', this.userStore.user?.apiKey, apiKey);
    if (!this.userStore.user?.apiKey && !apiKey) {
      console.error(
        'Cannot authenticate octokit because user is not signed in.'
      );
      return;
    }
    if (this.isAuthenticated()) {
      console.warn(
        'Cannot authenticate octokit because already authenticated.'
      );
      return;
    }
    // console.log("authenticating github", this.userStore.user.apiKey)

    this.graphqlAuth = this.graphql.defaults({
      headers: {
        authorization: `token ${apiKey || this.userStore.user.apiKey}`
      }
    });
  };

  unauthenticate = () => {
    this.graphqlAuth = null;
  };

  isAuthenticated = () => !!this.graphqlAuth;

  // Repo API
  getRepositoryRootNodes = async (owner, repo, branch = 'master') => {
    console.log('Getting ', owner, repo, branch, 'root files');
    if (!this.isAuthenticated()) {
      console.error('Octokit is not authenticated.');
      return null;
    }

    // If branch is specified, look for specific branch, otherwise look at default
    if (branch === 'master') {
      const query = formQueryGetRepositoryDefaultBranchRootNodes();
      try {
        const response = await this.graphqlAuth(
          `
          query GetRepositoryDefaultBranchRootNodes($owner: String!, $repo: String!) {
            repository(owner: $owner, name: $repo) {
              ${query}
            }
          }
          `,
          {
            owner,
            repo
          }
        );
        // this.fileStore.setRepositoryNodes(
        //   response?.repository?.defaultBranchRef?.target?.history?.nodes[0].tree
        //     ?.entries
        // );
        return response?.repository?.defaultBranchRef?.target?.history?.nodes[0]
          .tree?.entries;
      } catch (error) {
        console.error(
          'Error getting default branch repository root nodes.',
          owner,
          repo,
          branch,
          error
        );
      }
    } else {
      const query = formQueryGetRepositorySpecificBranchRootNodes(branch);
      try {
        const response = await this.graphqlAuth(
          `
          query GetRepositorySpecificBranchRootNodes($owner: String!, $repo: String!) {
            repository(owner: $owner, name: $repo) {
              ${query}
            }
          }
          `,
          {
            owner,
            repo
          }
        );
        // this.fileStore.setRepositoryNodes(
        //   response?.repository?.object?.entries
        // );
        return response?.repository?.object?.entries;
      } catch (error) {
        console.error(
          'Error getting specific branch repository root nodes.',
          owner,
          repo,
          branch,
          error
        );
      }
    }
    return null;
  };

  getRepositoryNodesAtLevel = async (owner, repo, branch, level = 0) => {
    console.log('Getting ', owner, repo, branch, level, 'level files');
    if (!this.isAuthenticated()) {
      console.error('Octokit is not authenticated.');
      return null;
    }
    const response = await this.graphqlAuth(
      `
      query RepositoryFilesOfSubtree($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
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
                        oid
                        path
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      `,
      {
        owner,
        repo
      }
    );
    this.fileStore.setRepositoryNodes(response);
    return response;
  };
}

// Provider
const OctoContext = createContext(null);
const OctoProvider = ({ children, store }) => {
  const [octoDAO, setOctoDAO] = useState();
  useEffect(() => {
    if (!isInitialized) {
      setOctoDAO(new OctoDAO(store));
    }
  }, []);

  return (
    <OctoContext.Provider value={octoDAO}>{children}</OctoContext.Provider>
  );
};
OctoProvider.propTypes = {
  children: PropTypes.element.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  store: PropTypes.object.isRequired
};

export { OctoContext };
export default OctoProvider;
