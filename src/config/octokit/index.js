import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { graphql } from '@octokit/graphql';

import { formQueryGetRepositorySpecificBranchRootNodes } from './queries';

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
  getRepositoryNodes = async (owner, repo, branch = 'HEAD', treePath = '') => {
    // console.log('Getting ', owner, repo, branch, treePath, 'root files');
    if (!this.isAuthenticated()) {
      console.error('Octokit is not authenticated.');
      return null;
    }

    const isRepositoryRoot = treePath === '';

    try {
      const response = await this.graphqlAuth(
        formQueryGetRepositorySpecificBranchRootNodes(branch, treePath),
        {
          owner,
          repo
        }
      );
      const files = response?.repository?.object?.entries;
      const parent = {
        oid: null,
        name: null,
        type: isRepositoryRoot ? 'root' : 'tree',
        path: treePath,
        children: files
      };
      this.fileStore.setRepositoryNodes(branch, parent, files);
      return response?.repository?.object?.entries;
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
