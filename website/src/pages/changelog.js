/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import Layout from '../components/layout';
import Link from '../components/Link';
import ConstrainedContainer from '../components/sections/ConstrainedContainer';
import SEO from '../components/seo';

const CHANGELOG_RAW =
  'https://raw.githubusercontent.com/AtomicCodeLabs/chummy/extension/prod/extension/CHANGELOG.md';

const ChangelogPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [data, setData] = useState();
  useEffect(() => {
    const fetchChangelogData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await (await fetch(CHANGELOG_RAW)).text();
        setData(response);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchChangelogData();
  }, []);

  return (
    <Layout
      // isSimpleNavbar
      mainClassName="min-h-screen h-full bg-blue-50"
      innerMainClassName="justify-start items-center"
      navbarBgColor="bg-blue-50"
      navbarSecondaryBgColor="bg-white"
      fitFooter
    >
      <SEO
        title="Changelog"
        description="Discover the latest and greatest updates to Chummy."
      />
      <ConstrainedContainer className="font-mono">
        {error && (
          <h3 className="text-red-500">
            There was an error fetching the latest changelog. <br />
            Please try again later.
          </h3>
        )}
        {!error &&
          (loading ? (
            <>
              <h1>Changelog</h1>
              <p>
                All notable changes to this project will be documented in this
                file. See{' '}
                <Link to="https://github.com/conventional-changelog/standard-version">
                  standard-version
                </Link>{' '}
                for commit guidelines.
              </p>
              <br />
              <p>Fetching the latest changes...</p>
            </>
          ) : (
            <ReactMarkdown>{data}</ReactMarkdown>
          ))}
      </ConstrainedContainer>
    </Layout>
  );
};

export default ChangelogPage;
