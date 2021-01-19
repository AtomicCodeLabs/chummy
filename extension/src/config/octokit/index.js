import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { graphql } from '@octokit/graphql';
import { Octokit } from '@octokit/rest';
import { throttling } from '@octokit/plugin-throttling';

import {
  formQueryGetRepositorySpecificBranchRootNodes,
  formSearchQuery
} from './queries';
import { sortFiles } from '../../utils';
import log from '../log';

let isInitialized = false;

class OctoDAO {
  constructor(store) {
    isInitialized = true;
    this.userStore = store.userStore; // mobx
    this.fileStore = store.fileStore;

    this.rest = Octokit;
    this.rest.plugin(throttling);
    this.restAuth = null;
    this.graphql = graphql;
    this.graphqlAuth = null;
  }

  // Auth API (Config with auth)

  authenticate = (apiKey) => {
    if (!this.userStore.user?.apiKey && !apiKey) {
      log.warn('Cannot authenticate octokit because user is not signed in.');
      return;
    }
    if (this.isAuthenticated()) {
      return;
    }

    this.graphqlAuth = this.graphql.defaults({
      headers: {
        authorization: `token ${apiKey || this.userStore.user.apiKey}`
      }
    });
    // eslint-disable-next-line new-cap
    this.restAuth = new this.rest({
      auth: apiKey || this.userStore.user.apiKey,
      throttle: {
        // eslint-disable-next-line consistent-return
        onRateLimit: (retryAfter, options) => {
          this.rest.log.warn(
            `Request quota exhausted for request ${options.method} ${options.url}`
          );

          // Retry twice after hitting a rate limit error, then give up
          if (options.request.retryCount <= 2) {
            log.debug(`Retrying after ${retryAfter} seconds!`);
            return true;
          }
        },
        onAbuseLimit: (retryAfter, options) => {
          // does not retry, only logs a warning
          this.rest.log.warn(
            `Abuse detected for request ${options.method} ${options.url}`
          );
        }
      }
    });
  };

  unauthenticate = () => {
    this.graphqlAuth = null;
    this.restAuth = null;
  };

  isAuthenticated = () => !!this.graphqlAuth && !!this.restAuth;

  // Repo API
  getRepositoryNodes = async (owner, repo, branch, treePath = '') => {
    if (!this.isAuthenticated()) {
      log.warn('Octokit is not authenticated.');
      return null;
    }

    // If the surface level nodes for this path already exist in the file store, don't make api request
    const foundNode = this.fileStore.getNode(owner, repo, branch, treePath);
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
        isOpen: true, // if request is made, this node is open
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
      log.error(
        'Error getting specific branch repository root nodes.',
        owner,
        repo,
        branch,
        error
      );
      return null;
    }
  };

  // Search API
  searchCode = async (
    owner,
    repo,
    queryFilename,
    queryCode,
    queryPath,
    language = null
  ) => {
    if (!this.isAuthenticated()) {
      log.warn('Octokit is not authenticated.');
      return null;
    }

    // TODO some caching
    try {
      const q = formSearchQuery(
        owner,
        repo,
        queryFilename,
        queryCode,
        queryPath,
        language
      );
      // https://docs.github.com/en/free-pro-team@latest/rest/reference/search#search-code
      const response = await this.restAuth.request('GET /search/code', {
        headers: {
          accept: 'application/vnd.github.v3.text-match+json'
        },
        q
      });
      return response?.data?.items;
    } catch (error) {
      log.error(
        'Error searching code.',
        owner,
        repo,
        queryFilename,
        queryCode,
        queryPath,
        language,
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
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  store: PropTypes.object.isRequired
};

export { OctoContext };
export default OctoProvider;
