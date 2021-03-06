// An example of "Amazon API Gateway Custom Authorizer" (node.js).

// Copyright (c) 2016 Authlete, Inc.
//
// The MIT License
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom
// the Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

// The API credentials of your service issued by Authlete.
// These are needed to call Authlete's introspection API.
var API_KEY    = '{Your-Service-API-Key}';
var API_SECRET = '{Your-Service-API-Secret}';

// Regular expression to extract an access token from
// Authorization header.
var BEARER_TOKEN_PATTERN = /^Bearer[ ]+([^ ]+)[ ]*$/i;

// Modules.
var async   = require('async');
var request = require('request');


// A function to extract the HTTP method and the resource path
// from event.methodArn.
function extract_method_and_path(arn)
{
  // The value of 'arn' follows the format shown below.
  //
  //   arn:aws:execute-api:<regionId>:<accountId>:<apiId>/<stage>/<method>/<resourcePath>"
  //
  // See 'Enable Amazon API Gateway Custom Authorization' for details.
  //
  //   http://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html
  //

  // Check if the value of 'arn' is available just in case.
  if (!arn)
  {
    // HTTP method and a resource path are not available.
    return [ null, null ];
  }

  var arn_elements      = arn.split(':', 6);
  var resource_elements = arn_elements[5].split('/', 4);
  var http_method       = resource_elements[2];
  var resource_path     = resource_elements[3];

  // Return the HTTP method and the resource path as a string array.
  return [ http_method, resource_path ];
}


// A function to extract an access token from Authorization header.
//
// This function assumes the value complies with the format described
// in "RFC 6750, 2.1. Authorization Request Header Field". For example,
// if "Bearer 123" is given to this function, "123" is returned.
function extract_access_token(authorization)
{
  // If the value of Authorization header is not available.
  if (!authorization)
  {
    // No access token.
    return null;
  }

  // Check if it matches the pattern "Bearer {access-token}".
  var result = BEARER_TOKEN_PATTERN.exec(authorization);

  // If the Authorization header does not match the pattern.
  if (!result)
  {
    // No access token.
    return null;
  }

  // Return the access token.
  return result[1];
}


// A function to get a list of required scopes as a string array
// from a combination of an HTTP method and a resource path.
// For example, ["profile", "email"]. When a non-empty array is
// returned, the Authlete server (= the implementation of Authlete's
// introspection API) checks if all the scopes are covered by the
// access token. When this method returns null, such a check on
// scopes is not performed.
function get_required_scopes(http_method, resource_path)
{
  // Customize as necessary.
  return null;
}


// A function to call Authlete's introspection API.
//
// This function is used as a task for 'waterfall' method of 'async' module.
// See https://github.com/caolan/async#user-content-waterfalltasks-callback
// for details about 'waterfall' method.
//
//   * access_token (string) [REQUIRED]
//       An access token whose information you want to get.
//
//   * scopes (string array) [OPTIONAL]
//       Scopes that should be covered by the access token. If the scopes
//       are not covered by the access token, the value of 'action' in the
//       response from Authlete's introspection API is 'FORBIDDEN'.
//
//   * callback
//       A callback function that 'waterfall' of 'async' module passes to
//       a task function.
//
function introspect(access_token, scopes, callback)
{
  request({
    // The URL of Authlete's introspection API.
    url: 'https://api.authlete.com/api/auth/introspection',

    // HTTP method.
    method: 'POST',

    // The API credentials for Basic Authentication.
    auth: {
      username: API_KEY,
      pass: API_SECRET
    },

    // Request parameters passed to Authlete's introspection API.
    json: true,
    body: {
      token: access_token,
      scopes: scopes
    },

    // Interpret the response from Authlete's introspection API as a UTF-8 string.
    encoding: 'utf8'
  }, function(error, response, body) {
    if (error) {
      // Failed to call Authlete's introspection API.
      callback(error);
    }
    else if (response.statusCode != 200) {
      // The response from Authlete's introspection API indicates something wrong
      // has happened.
      callback(response);
    }
    else {
      // Call the next task of 'waterfall'.
      //
      // 'body' is already a JSON object. This has been done by 'request' module.
      // As for properties that the JSON object has, see the JavaDoc of
      // com.authlete.common.dto.IntrospectionResponse class in authlete-java-common.
      //
      //   http://authlete.github.io/authlete-java-common/com/authlete/common/dto/IntrospectionResponse.html
      //
      callback(null, body);
    }
  });
}


// A function to generate a response from Authorizer to API Gateway.
function generate_policy(principal_id, effect, resource)
{
  return {
    principalId: principal_id,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource
      }]
    }
  };
}


// An authorizer implementation
exports.handler = function(event, context)
{
  // Get information about the function that is requested to be invoked.
  // Extract the HTTP method and the resource path from event.methodArn.
  var elements = extract_method_and_path(event.methodArn);
  var http_method   = elements[0];
  var resource_path = elements[1];

  // The access token presented by the client application.
  var access_token = extract_access_token(event.authorizationToken);

  // If the request from the client does not contain an access token.
  if (!access_token) {
    // Write a log message and tell API Gateway to return "401 Unauthorized".
    console.log("[" + http_method + "] " + resource_path + " -> No access token.");
    context.fail("Unauthorized");
    return;
  }

  // Get the list of required scopes for the combination of the HTTP method
  // and the resource path.
  var required_scopes = get_required_scopes(http_method, resource_path);

  async.auto({}, function (err, result) {

  });

  async.waterfall([
    function(callback) {
      // Validate the access token by calling Authlete's introspection API.
      introspect(access_token, required_scopes, callback);
    },
    function(response, callback) {
      // Write a log message about the result of the access token validation.
      console.log("[" + http_method + "] " + resource_path + " -> " +
                  response.action + ":" + response.resultMessage);

      // The 'action' property contained in a response from Authlete's
      // introspection API indicates the HTTP status that the caller
      // (= an implementation of protected resource endpoint) should
      // return to the client application. Therefore, dispatch based
      // on the value of 'action'.
      switch (response.action) {
        case 'OK':
          // The access token is valid. Tell API Gateway that the access
          // to the resource is allowed. The value of 'subject' property
          // contained in a response from Authlete's introspection API is
          // the subject (= unique identifier) of the user who is associated
          // with the access token.
          context.succeed(generate_policy(response.subject, 'Allow', event.methodArn));
          break;

        case 'BAD_REQUEST':
        case 'FORBIDDEN':
          // Tell API Gateway that the access to the resource should be denined.
          context.succeed(generate_policy(response.subject, 'Deny', event.methodArn));
          break;

        case 'UNAUTHORIZED':
          // Tell API Gateway to return "401 Unauthorized" to the client application.
          context.fail("Unauthorized");
          break;

        case 'INTERNAL_SERVER_ERROR':
        default:
          // Return "Internal Server Error". When the value passed to
          // context.fail() is other value than "unauthorized", it is
          // treated as "500 Internal Server Error".
          context.fail("Internal Server Error");
          break;
      }

      callback(null);
    }
  ], function (error) {
    if (error) {
      // Something wrong has happened.
      context.fail(error);
    }
  });
};