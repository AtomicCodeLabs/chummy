import { useStaticQuery, graphql } from 'gatsby';

import editions from '../data/editions';

const usePrices = () => {
  const nodes = useStaticQuery(graphql`
    query ProductPrices {
      prices: allStripePrice(
        filter: { active: { eq: true } }
        sort: { fields: [unit_amount] }
      ) {
        edges {
          node {
            id
            active
            currency
            unit_amount
            nickname
            billing_scheme
            product {
              id
              name
              metadata {
                monthly_unit_amount
                yearly_unit_amount
              }
            }
          }
        }
      }
    }
  `)?.prices?.edges;

  const getPriceForEdition = (nickNameId, metadataId = null) => {
    const foundNode = nodes.find((n) => n.node.nickname === nickNameId)?.node;
    // If pricing type is tiered, look at metadata for unit amounts
    if (foundNode.billing_scheme === 'tiered') {
      return foundNode?.product?.metadata?.[metadataId] / 100;
    }
    return foundNode?.unit_amount / 100;
  };

  const getEdition = (editionName) => ({
    ...editions[editionName],
    monthlyPrice: getPriceForEdition(
      editions[editionName].nicknameId.monthly,
      editions[editionName]?.metadataId?.monthly
    ),
    yearlyPrice: getPriceForEdition(
      editions[editionName].nicknameId.yearly,
      editions[editionName]?.metadataId?.yearly
    )
  });

  return {
    Community: getEdition('Community'),
    Professional: getEdition('Professional'),
    Enterprise: getEdition('Enterprise')
  };
};

export default usePrices;
