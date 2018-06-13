const jose = require('node-jose');
const https = require('https');

const region = 'us-east-1';
const userpoolId = 'us-east-1_KO5tw7TRw';
const app_client_id = 'itkne97d1g6udj488kjb9ej2b';
const keys_url = 'https://cognito-idp.' + region + '.amazonaws.com/' + userpoolId + '/.well-known/jwks.json';


const decodeVerifyAndReturnUsername = (token) => new Promise((resolve, reject) => {
  const sections = token.split('.');

  // get the kid from the headers prior to verification
  let header = jose.util.base64url.decode(sections[0]);
  header = JSON.parse(header);
  const kid = header.kid;

  // download the public keys
  https.get(keys_url, (response) => {
    if (response.statusCode === 200) {
      response.on('data', function(body) {
        const keys = JSON.parse(body)['keys'];
        // search for the kid in the downloaded public keys
        const keyIndex = keys.findIndex(key => key.kid === kid);
        if (keyIndex === -1) {
          console.log('Public key not found in jwks.json');
          reject({message: 'Public key not found in jwks.json', username: undefined})
        }
        // construct the public key
        jose.JWK.asKey(keys[keyIndex]).
        then(function(result) {
          // verify the signature
          jose.JWS.createVerify(result).
          verify(token).
          then(function(result) {
            // now we can use the claims
            const claims = JSON.parse(result.payload);
            // additionally we can verify the token expiration
            const currentTimestamp = Math.floor(new Date() / 1000);
            if (currentTimestamp > claims.exp) {
              reject({message: 'Token is expired', username: undefined})
            }
            // and the Audience (use claims.client_id if verifying an access token)
            if (claims.aud !== app_client_id) {
              reject({message: 'Token was not issued for this audience', username: undefined})
            }
            resolve({message: 'Success', username: claims["cognito:username"]})
          }).
          catch(function() {
            reject({message: 'Signature verification failed', username: undefined, token})
          });
        })
        .catch(err => { reject({message: err, username: undefined})});
      });
    }
  });
});


module.exports.decodeVerifyAndReturnUsername = decodeVerifyAndReturnUsername;

