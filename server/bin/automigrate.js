var path = require('path');
var app = require(path.resolve(__dirname, '../server'));

var todos = [
        {id: 1, title: 'go to school', caption: 'going to school', done: true, timedone: new Date(), created_by_id: 1},
        {id: 2, title: 'getting job', caption: 'going to work, getting jobs', done: true, timedone: new Date(), created_by_id: 1},
        {id: 3, title: 'go to work', caption: 'going to work', done: false, timedone: null, created_by_id: 1},
        {id: 4, title: 'shopping', caption: 'going to shop some stuff', done: false, timedone: null, created_by_id: 1},
        {id: 5, title: 'make drawing', caption: 'create home drawing, font face', done: false, timedone: null, created_by_id: 1}
    ];
var accounts = [
		{id:1, username: 'ryan', password: 'ryan', email: 'izhur2001@gmail.com'}
	];

var dataSource = app.dataSources.tododb;

dataSource.automigrate('Todo', function(err) {
  if (err) console.log(err);

  var Todo = app.models.Todo;
  var count = todos.length;

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
}); 