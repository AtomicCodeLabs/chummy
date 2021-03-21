import React, { useState } from 'react';
import clsx from 'clsx';
import ReactPlayer from 'react-player/youtube';
import { CgPlayButton } from 'react-icons/cg';
import Img from 'gatsby-image';
import { useStaticQuery, graphql } from 'gatsby';

import ColumnSection from './ColumnSection';

export const DemoVideo = ({ className }) => {
  const data = useStaticQuery(graphql`
    query {
      social: file(relativePath: { eq: "social/social1200_628.png" }) {
        childImageSharp {
          fluid(maxWidth: 1000, quality: 90) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `);
  const [started, setStarted] = useState(false);
  const startVideo = () => {
    setStarted(true);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={clsx(
        'relative z-0 w-full overflow-hidden cursor-pointer rounded-xl shadow-xl-center group',
        className
      )}
      onClick={startVideo}
      onKeyDown={startVideo}
    >
      {started ? (
        <div
          className="w-full h-full"
          style={{
            paddingTop: 'calc(628 / 1200 * 100%)' // height/width aspect ratio
          }}
        >
          <ReactPlayer
            style={{ position: 'absolute', top: 0, left: 0 }}
            light={false}
            width="100%"
            height="100%"
            controls
            pip
            url="https://www.youtube.com/watch?v=sKid01-p09s"
          />
        </div>
      ) : (
        <>
          <Img
            fluid={data.social?.childImageSharp?.fluid}
            alt="Cluttered windows and extension"
            className="absolute"
            imgStyle={{ objectFit: 'contain' }}
          />
          <div className="absolute inset-0 z-10 items-center justify-center w-full h-full transition-all opacity-0 group-hover:opacity-100 group-hover:flex">
            <div className="w-full h-full bg-gray-100 opacity-0 group-hover:opacity-30" />
            <div className="absolute inset-0 z-20 flex items-center justify-center w-full h-full">
              <CgPlayButton className="w-32 h-32 md:w-20 md:h-20" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const DemoSection = () => (
  <div>
    <ColumnSection
      title={
        <h2 className="leading-tight">Watch a 73&apos;&apos; tutorial.</h2>
      }
      className="sm:mt-12"
    >
      <DemoVideo />
    </ColumnSection>
  </div>
);

export default DemoSection;
