import React from 'react';
import Loadable from '@loadable/component';

import Layout from '../components/layout';
import ConstrainedContainer from '../components/sections/ConstrainedContainer';
import SEO from '../components/seo';
import { TeamText, WhyChummy } from '../data/team';

import teamGif from '../images/team/team.gif';
import teamImg from '../images/team/team.jpg';

const Gif = Loadable(() => import('../components/Gif'));

const TeamPage = () => (
  <Layout
    innerMainClassName="justify-start items-center"
    navbarBgColor="bg-white"
    navbarSecondaryBgColor="bg-white"
    footerClassName="mt-60"
  >
    <SEO title="Checkout" />
    <ConstrainedContainer>
      <div className="text-center">
        <h1>
          About the{' '}
          <span
            className="italic"
            style={{
              background:
                'linear-gradient(to top, #39FF14 50%, transparent 50%)'
            }}
          >
            Team
          </span>
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center text-center">
        <div className="max-w-lg mt-16 overflow-hidden rounded-lg shadow-lg cursor-pointer">
          <Gif gif={teamGif} still={teamImg} />
        </div>
        <TeamText />
      </div>
      <div>
        <WhyChummy />
      </div>
    </ConstrainedContainer>
  </Layout>
);

export default TeamPage;
