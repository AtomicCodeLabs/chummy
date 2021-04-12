import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

import Link from '../components/Link';
import { DemoVideo } from '../components/sections/DemoSection';
import BrowserBox from '../components/boxes/BrowserBox';

export const Steps = () => {
  const data = useStaticQuery(graphql`
    query {
      pin: file(relativePath: { eq: "tutorial/pin.png" }) {
        ...tutorialImage
      }
      click: file(relativePath: { eq: "tutorial/click.png" }) {
        ...tutorialImage
      }
      opera: file(relativePath: { eq: "browsers/opera.png" }) {
        ...tutorialImage
      }
    }
  `);
  return (
    <>
      <h2 className="mt-16 mb-10">Watch a 90&quot; demo.</h2>
      <div className="flex flex-col items-center">
        <DemoVideo />
      </div>
      <h2 className="mt-16 mb-10">Step 1. Download the extension.</h2>
      <p className="mb-6 text-lg text-center md:text-base sm:text-md">
        Click on one of the icons below.
      </p>
      <div className="flex flex-col items-center">
        <BrowserBox iconClassName="w-12 h-12 mx-3" />
      </div>
      {/* <h2 className="mt-16 mb-10">Step 2. Pin the extension.</h2>
      <div className="flex flex-col items-center">
        <Img
          fluid={data.pin.childImageSharp.fluid}
          alt="Pin extension"
          className="shadow-xl-center w-96 rounded-xl"
        />
      </div>
      <br /> */}
      <h2 className="mt-16 mb-10">Step 2. Click the extension.</h2>
      <div className="flex flex-col items-center">
        <Img
          fluid={data.pin.childImageSharp.fluid}
          alt="Pin extension"
          className="mb-5 shadow-xl-center w-96 rounded-xl"
        />
        <Img
          fluid={data.click.childImageSharp.fluid}
          alt="Click extension"
          className="shadow-xl-center rounded-xl w-96"
        />
      </div>
      <h2 className="mt-16 mb-10">Step 3. Visit any GitHub repository.</h2>
      <p className="text-lg text-center md:text-base sm:text-sm">
        <Link to="https://github.com/AtomicCodeLabs/chummy">
          Here&apos;s a nice one called AtomicCodeLabs/chummy.
        </Link>
      </p>
      <h2 className="mt-16 mb-10">Step 4. ???? Profit!</h2>
    </>
  );
};

export const tutorialImage = graphql`
  fragment tutorialImage on File {
    childImageSharp {
      fluid(maxWidth: 600) {
        ...GatsbyImageSharpFluid
      }
    }
  }
`;
