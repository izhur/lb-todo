// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('app', ['ionic','ionic-material','ui.router','angularMoment',
    'app.auth','app.controllers','app.directives','lbServices'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  
  $ionicConfigProvider.views.maxCache(0);

  $stateProvider.state('app',{
    url: '/app',
    abstract: true,
    templateUrl: 'templates/base.html',
    controller: 'AppCtrl'
  })
  .state('app.todos',{
    url: '/todos',
    views: {
      'contentPart': {
        templateUrl: 'templates/todos.html',
        controller: 'TodosCtrl',
      }
    },
    authenticate: true
  })
  .state('app.signin',{
    url: '/signin',
    views: {
      'contentPart': {
        templateUrl: 'templates/signin.html',
        controller: 'SignCtrl'
      }
    }
  })
  .state('app.signup',{
    url: '/signup',
    views: {
      'contentPart': {
        templateUrl: 'templates/signup.html',
        controller: 'SignCtrl'
      }
    }
  })
  .state('app.forbidden', {
    url: '/forbidden',
    views: {
      'contentPart': {
        templateUrl: 'templates/forbidden.html',
        controller: 'TodosCtrl',
      }
    }
  })
  ;

  $urlRouterProvider.otherwise('/app/signin');
})

.run(['$rootScope', '$state', 'AuthService', function($rootScope, $state, AuthService) {

  AuthService.getCurrent().then(function(result){
    if ($state.current.name=='app.signin') {
      $state.go('app.todos');
    }
  });

  $rootScope.$on('$stateChangeStart', function(evt, next) {
    // redirect to login page if not logged in
    //console.log($rootScope.currentUser,next.authenticate);
    if (next.authenticate && !$rootScope.currentUser) {
      evt.preventDefault(); //prevent current page from loading
      //console.log('bbbbb',$rootScope.currentUser);
      $state.go('app.forbidden');
    }
  });
}]);