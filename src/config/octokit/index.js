import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { graphql } from '@octokit/graphql';
import { toJS } from 'mobx';

import { formQueryGetRepositorySpecificBranchRootNodes } from './queries';
import { sortFiles } from '../../utils';

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
  getRepositoryNodes = async (owner, repo, branch, treePath = '') => {
    if (!this.isAuthenticated()) {
      console.error('Octokit is not authenticated.');
      return null;
    }

    // If the surface level nodes for this path already exist in the file store, don't make api request
    const foundNode = this.fileStore.getNode(
      owner,
      repo,
      branch.name,
      treePath
    );
    if (foundNode?.children) {
      return foundNode.children;
    }

    try {
      const response = await this.graphqlAuth(
        formQueryGetRepositorySpecificBranchRootNodes(branch.name, treePath),
        {
          owner,
          repo
        }
      );
      // Sort files before storing
      const entries = response?.repository?.object?.entries;
      if (!entries) {
        return null;
      }
      const files = [...entries].sort(sortFiles);
      const node = {
        oid: null,
        id: null,
        name: null,
        type: 'tree',
        path: treePath,
        children: files,
        repo: {
          owner,
          name: repo,
          type: 'tree'
        },
        branch
      };
      this.fileStore.setNode(node);
      return files;
    } catch (error) {
      console.error(
        'Error getting specific branch repository root nodes.',
        owner,
        repo,
        branch,
        error
      );
      return null;
    }
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
