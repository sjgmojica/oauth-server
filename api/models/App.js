/**
* App.js
*/

module.exports = {
  tableName: "apps",

  attributes: {
    name: {
      type: "string",
      required: true,
      columnName: "name"
    },

    description: {
      type: "string",
      required: true,
      columnName: "description"
    },

    secretId: {
      type: "string",
      required: true,
      columnName: "secret_id"
    },

    secretKey: {
      type: "string",
      required: true,
      columnName: "secret_key"
    },

    redirectUrl: {
      type: "string",
      columnName: "redirect_url"
    },

    createdAt: {
      type: "string",
      columnName: "created_at"
    },

    updatedAt: {
      type: "string",
      columnName: "updated_at"
    }
  }
}
