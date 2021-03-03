import { useStaticQuery, graphql } from 'gatsby';
import { useEffect, useState } from 'react';
import { stripeApi } from '../config/stripe';

import editions from '../data/editions';

const usePrices = () => {
  const products = useStaticQuery(graphql`
    query Products {
      products: allStripeProduct(filter: { active: { eq: true } }) {
        edges {
          node {
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
  `)
    ?.products?.edges?.filter(({ node: { name } }) =>
      ['Chummy Community', 'Chummy Professional', 'Chummy Enterprise'].includes(
        name
      )
    )
    ?.map(({ node: { name, id, metadata } }) => ({
      id,
      tier: name.split(' ')?.[1],
      metadata
    }));

  // Dynamically get prices
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState();

  const getPriceForEdition = (
    productPrices,
    nickNameId,
    metadata = null,
    metadataId = null
  ) => {
    const foundNode = productPrices?.find(
      (price) => price?.nickname === nickNameId
    );
    // If pricing type is tiered, look at metadata for unit amounts
    if (foundNode.billing_scheme === 'tiered' && metadata && metadataId) {
      return metadata?.[metadataId] / 100;
    }
    return foundNode?.unit_amount / 100 || 0;
  };

  useEffect(() => {
    const getPrices = async () => {
      setLoading(true);

      const finalPrices = (
        await Promise.all(
          products.map(async (product) => {
            const productPrices = (
              await stripeApi('/prices', {
                product: product.id,
                active: true
              })
            )?.data?.data;
            return {
              ...editions[product.tier],
              productId: product.id,
              tier: product.tier,
              monthlyPrice: getPriceForEdition(
                productPrices,
                editions[product.tier].nicknameId.monthly,
                product?.metadata,
                editions[product.tier]?.metadataId?.monthly
              ),
              yearlyPrice: getPriceForEdition(
                productPrices,
                editions[product.tier].nicknameId.yearly,
                product?.metadata,
                editions[product.tier]?.metadataId?.yearly
              )
            };
          })
        )
      ).reduce(
        (cumMap, product) => ({ ...cumMap, [product.tier]: product }),
        {}
      );

      setLoading(false);

      setPrices(finalPrices);
    };

    if (!prices) {
      getPrices();
    }
  }, []);

  return { loading, prices };
};

export default usePrices;
