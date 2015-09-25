module.exports = function(Todo) {
	Todo.beforeRemote('create',function(context, user, next) {
		var req = context.req;
		//console.log(context.req.accessToken);
		req.body.created_at = Date.now();
		req.body.created_by_id = context.req.accessToken.userId;
		next();
	});

	Todo.beforeRemote('*.save',function(context,unused, next){
		var req = context.req;
		if (req.body.done=true) {
			req.body.timedone = Date.now();
		} else {
			req.body.timedone = null;
		}
		req.body.updated_at = Date.now();
		console.log(req.body);
		next();
	});

	Todo.beforeUpdate = function(next,model){
		//console.log(model);
		model.updated_at = Date.now();
		next();
	};
};
