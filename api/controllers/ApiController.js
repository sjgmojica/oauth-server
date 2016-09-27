/**
 * ApiController
 *
 * @description :: Server-side logic for managing Apis
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  info: function (req, res) {

    res.json(200, {
      payload: "If you see this message, you are OAuth Authenticated"
    });

  }
	
};

