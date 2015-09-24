var async = require('async');
var path = require('path');
var app = require(path.resolve(__dirname, '../server'));

var tododb = app.dataSources.tododb;

async.parallel({
	accounts: async.apply(createAccounts),
}, function(err, results) {
	if (err) throw err;
	return createTodos(results.accounts, function(err) {
  		if (err) throw err;
  		console.log('> models created successfully');
	});
});

// create accounts
function createAccounts(cb) {
    tododb.automigrate('Account', function(err) {
    	if (err) return cb(err);

    	app.models.Account.create([
	        {id: 1, username: 'foo', email: 'foo@bar.com', password: 'foobar'},
	        {id: 2, username: 'john', email: 'john@doe.com', password: 'johndoe'},
	        {id: 3, username: 'jane', email: 'jane@doe.com', password: 'janedoe'},
	        {id: 4, username: 'ryan', password: 'ryan', email: 'izhur2001@gmail.com'}
      ], cb);
    });
}

	// create todos
function createTodos(accounts, cb) {
    tododb.automigrate('Todo', function(err) {
      if (err) return cb(err);

      app.models.Todo.create([
        {id: 1, title: 'go to school', caption: 'going to school', done: true, timedone: new Date(), created_by_id: accounts[3].id},
        {id: 2, title: 'getting job', caption: 'going to work, getting jobs', done: true, timedone: new Date(), created_by_id: accounts[3].id},
        {id: 3, title: 'go to work', caption: 'going to work', done: false, timedone: null, created_by_id: accounts[3].id},
        {id: 4, title: 'shopping', caption: 'going to shop some stuff', done: false, timedone: null, created_by_id: accounts[3].id},
        {id: 5, title: 'make drawing', caption: 'create home drawing, font face', done: false, timedone: null, created_by_id: accounts[3].id}
      ], cb);
    });
}

/*var path = require('path');
var app = require(path.resolve(__dirname, '../server'));

var todos = [
        {id: 1, title: 'go to school', caption: 'going to school', done: true, timedone: new Date()},
        {id: 2, title: 'getting job', caption: 'going to work, getting jobs', done: true, timedone: new Date()},
        {id: 3, title: 'go to work', caption: 'going to work', done: false, timedone: null},
        {id: 4, title: 'shopping', caption: 'going to shop some stuff', done: false, timedone: null},
        {id: 5, title: 'make drawing', caption: 'create home drawing, font face', done: false, timedone: null}
    ];
var accounts = [
		{id:1, username: 'ryan', password: 'ryan', email: 'izhur2001@gmail.com'}
	];

var dataSource = app.dataSources.tododb;

dataSource.automigrate('Todo', function(err) {
  if (err) console.log(err);

  var Todo = app.models.Todo;
  var count = todos.length;

  var

  todos.forEach(function(todo) {
    Todo.create(todo, function(err, record) {
      if (err) return console.log(err);

      console.log('Record created:', record);

      count--;

      if (count === 0) {
        console.log('done');
        dataSource.disconnect();
      }
    });
  });
});

dataSource.automigrate('Account', function(err) {
  if (err) console.log(err);

  var Account = app.models.Account;
  var count = accounts.length;

  accounts.forEach(function(account) {
    Account.create(account, function(err, record) {
      if (err) return console.log(err);

      console.log('Record created:', record);

      count--;

      if (count === 0) {
        console.log('done');
        dataSource.disconnect();
      }
    });
  });
}); */