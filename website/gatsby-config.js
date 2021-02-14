const path = require('path');
const packageInfo = JSON.parse(
  JSON.stringify(
    // eslint-disable-next-line import/no-dynamic-require
    require(path.join(__dirname, 'package.json'))
  )
);

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

module.exports = {
  siteMetadata: {
    title: packageInfo.name,
    description: packageInfo.description,
    author: packageInfo.author
  },
  plugins: [
    { resolve: `gatsby-plugin-react-helmet` },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    { resolve: `gatsby-transformer-sharp` },
    { resolve: `gatsby-plugin-sharp` },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `${__dirname}/src/images/chummy256.png` // This path is relative to the root of the site.
      }
    },
    { resolve: 'gatsby-plugin-postcss' },
    {
      resolve: `gatsby-source-stripe`,
      options: {
        objects: ['Price', 'Product', 'Invoice'],
        secretKey: process.env.STRIPE_SECRET_KEY,
        downloadFiles: false
      }
    }
  ]
};
