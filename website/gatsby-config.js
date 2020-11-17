require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

module.exports = {
  siteMetadata: {
    title: `Gatsby Firebase Authentication`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/app/*`] }
    },
    {
      resolve: 'gatsby-plugin-firebase',
      options: {
        features: {
          auth: true,
          database: false,
          firestore: true,
          storage: false,
          messaging: false,
          functions: false,
          performance: false
        },
        credentials: {
          apiKey: '<YOUR_FIREBASE_API_KEY>',
          authDomain: '<YOUR_FIREBASE_AUTH_DOMAIN>',
          databaseURL: '<YOUR_FIREBASE_DATABASE_URL>',
          projectId: '<YOUR_FIREBASE_PROJECT_ID>',
          storageBucket: '<YOUR_FIREBASE_STORAGE_BUCKET>',
          messagingSenderId: '<YOUR_FIREBASE_MESSAGING_SENDER_ID>',
          appId: '<YOUR_FIREBASE_APP_ID>'
        }
      }
    }
  ]
};
