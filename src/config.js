
/* eslint-disable no-undef */
const appConfig = {
  clientID: '',
  clientSecret: '',
  apiBaseUrl: 'https://localhost:8243/am/sample/pizzashack/v1/api/v1',

  signInRedirectURL: "http://localhost:3000",
  signOutRedirectURL: "http://localhost:3000",
  baseUrl: "https://localhost:9443",
  scope: [ "openid", "profile", "address", "phone", "orderCreate" ]
};

export default appConfig;
