/*
 * Exception
 *
 */

var stderror = require("stderror");
var Exception = stderror.extend("Exception");

//==============================================================================
//-- define exceptions here...

Exception.define({name: "UnknownError", message: "Unknown error"});
Exception.define({name: "SystemError", message: "System error"});
Exception.define({name: "Forbidden", message: "Forbidden"});
Exception.define({name: "ValidationError", message: "Validation error"});
Exception.define({name: "InternalServerError", message: "Internal server error"});
Exception.define({name: "InvalidCSRF", message: "Invalid CSRF"});
Exception.define({name: "RecordNotFound", message: "Record Not Found"});
Exception.define({name: "InvalidArgument", message: "Invalid argument"});
Exception.define({name: "RecordAlreadyExists", message: "Account already exists"});

//==============================================================================
//-- exports

module.exports = Exception;
