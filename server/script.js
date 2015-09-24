var path = require('path');
var app = require(path.resolve(__dirname, 'server'));
var ds = app.dataSources.tododb;

Account = ds.createModel('Account', {
    _id: { type: Number, id: true }
});