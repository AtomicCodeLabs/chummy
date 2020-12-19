// eslint-disable-next-line import/prefer-default-export
export const interceptJS = () => {
  // Intercept all requests to make sure files are being pulled from the correctly
  // sered directory
  cy.intercept(
    {
      method: 'GET',
      url: '**/*.js'
    },
    (req) => {
      const filename = req.url.split('/').pop();
      console.log('INTERCEPTED', req, Cypress.config().baseUrl, filename);
      req.url = `${Cypress.config().baseUrl}/${filename}`;
    }
  );
};
