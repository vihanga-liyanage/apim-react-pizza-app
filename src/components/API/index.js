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

// request the token
// subscribe to this event and use the returned json to save your token to state or session storage
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
    let response = await fetch(`${config.tokenBaseUrl}/oauth2/token?${params}`, options);
    let responseJson = await response.json();

    return responseJson;
  } catch(error) {
    console.error(error);
  }
  
}
