import config from '../../config';

// eslint-disable-next-line no-undef
const BASE_URL = process.env.REACT_APP_BASE_API_ENDPOINT;
let access_token = '';

export async function getMenu() {

  if (!config.clientID || !config.clientSecret) {
    return {
      error: 'Error',
      description: 'Please configure API information to view the Pizza menu!'
    }
  }

  if (access_token == '') {
    const tokenResponse = await getAccessToken();

    if (tokenResponse.access_token) {
      access_token = tokenResponse.access_token;
    } else {
      console.log("Something went wrong!");
    }
  }
  
  try {
    let response = await fetch(`${config.apiBaseUrl}/menu`, {
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    });
    let responseJson = await response.json();
    return responseJson;
  } catch(error) {
    throw error;
  }

}

export async function sendOrder(token, orderDataString) {

  try {
    let response = await fetch(`${config.apiBaseUrl}/order`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: orderDataString
    });
    let responseJson = await response.json();
    return responseJson;
  } catch(error) {
    throw error;
  }

}

// Get an access token using client credential grant
export async function getAccessToken() {
  
  var options = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    }
  };

  let params = 'grant_type=client_credentials&client_id=' + 
    config.clientID + '&client_secret=' + config.clientSecret;
  
  try {
    let response = await fetch(`${config.baseUrl}/oauth2/token?${params}`, options);
    let responseJson = await response.json();

    return responseJson;
  } catch(error) {
    console.error(error);
  }
  
}
