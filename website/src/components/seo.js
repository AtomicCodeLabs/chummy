/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

function SEO({ description, lang, meta, title, pathname }) {
  const { site, metaImage } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            motto
            description
            author
            url
            keywords
            twitterUsername
          }
        }
        metaImage: file(relativePath: { eq: "social1200_628.png" }) {
          childImageSharp {
            fluid(maxHeight: 628) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `
  );

  const metaDescription = description || site.siteMetadata.description;
  const url = site.siteMetadata?.url;
  const image = metaImage?.childImageSharp?.fluid?.src;
  const motto = site.siteMetadata?.motto;
  const canonical = pathname ? `${site.siteMetadata.siteUrl}${pathname}` : null;

  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      title={title || site.siteMetadata?.title}
      titleTemplate={motto ? `%s | ${motto}` : null}
      link={
        canonical
          ? [
              {
                rel: 'canonical',
                href: canonical
              }
            ]
          : []
      }
      meta={[
        {
          name: `description`,
          content: metaDescription
        },
        {
          property: `og:title`,
          content: title
        },
        {
          property: `og:url`,
          content: url
        },
        {
          property: `og:description`,
          content: metaDescription
        },
        {
          property: `og:type`,
          content: `website`
        },
        {
          name: `twitter:creator`,
          content:
            site.siteMetadata?.twitterUsername ||
            site.siteMetadata?.author ||
            ''
        },
        {
          name: `twitter:title`,
          content: title
        },
        {
          name: `twitter:description`,
          content: metaDescription
        },
        {
          name: 'keywords',
          content: site.siteMetadata.keywords.join(',')
        }
      ]
        .concat(
          metaImage
            ? [
                {
                  property: 'og:image',
                  content: image
                },
                {
                  property: 'og:image:width',
                  content: metaImage.width
                },
                {
                  property: 'og:image:height',
                  content: metaImage.height
                },
                {
                  name: 'twitter:card',
                  content: 'summary_large_image'
                }
              ]
            : [
                {
                  name: 'twitter:card',
                  content: 'summary'
                }
              ]
        )
        .concat(meta)}
    />
  );
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
  pathname: '',
  image: null
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
  }),
  pathname: PropTypes.string
};

export default SEO;
