module.exports = {
    plugins: [
        {
          resolve: `gatsby-source-drupal`,
          options: {
            baseUrl: 'http://dev-a11y-issues.pantheonsite.io/jsonapi/node/issue?page[limit]=200&page[offset]=10'
          },
        },
        `gatsby-plugin-emotion`,
        {
          resolve: `gatsby-plugin-typography`,
          options: {
            pathToConfigModule: `src/utils/typography`,
          },
        },
      ]
  }