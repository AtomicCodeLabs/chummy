import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { graphql } from '@octokit/graphql';

let isInitialized = false;

class OctoDAO {
  constructor(store) {
    isInitialized = true;
    this.userStore = store.userStore; // mobx
    this.fileStore = store.fileStore;

    this.graphql = graphql;
    this.graphqlAuth = null;
    this.authenticate();
  }

  // Auth API (Config with auth)

  authenticate = () => {
    if (!this.userStore.user?.apiKey) {
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
        authorization: `token ${this.userStore.user.apiKey}`
      }
    });
  };

  unauthenticate = () => {
    this.graphqlAuth = null;
  };

  isAuthenticated = () => !!this.graphqlAuth;

  // Repo API
  getRepository = async (owner, repo) => {
    // console.log("GRAPHQLAUTH", this.graphqlAuth)
    if (!this.isAuthenticated()) {
      console.error(
        'Cannot authenticate octokit because user is not signed in.'
      );
      return null;
    }
    const response = await this.graphqlAuth(
      `
        query lastIssues($owner: String!, $repo: String!, $num: Int = 3) {
          repository(owner: $owner, name: $repo) {
            issues(last: $num) {
              edges {
                node {
                  title
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
    this.fileStore.setRepositoryFiles(response);
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
