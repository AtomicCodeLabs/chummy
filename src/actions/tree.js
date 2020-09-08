// import { graphql } from '@octokit/graphql';

// const graphqlWithAuth = graphql.defaults({
//   headers: {
//     authorization: `token secret123`
//   }
// });

// export const getTree = async () => {
//   const { repository } = await graphqlWithAuth(`
//   {
//     repository(owner: "octokit", name: "graphql.js") {
//       issues(last: 3) {
//         edges {
//           node {
//             title
//           }
//         }
//       }
//     }
//   }
// `);
// };
