angular
  .module('app.auth',[])
  .factory('AuthService', ['Account', '$q', '$rootScope', 'LoopBackAuth', function(User, $q,
      $rootScope, LoopBackAuth) {
    function login(username, password) {
      return User
        .login({username: username, password: password, rememberMe: true})
        .$promise
        .then(function(response) {
          //console.log(response);
          $rootScope.currentUser = {
            id: response.user.id,
            tokenId: response.id,
            email: response.user.email,
            username: response.user.username
          };
        });
    }

    function logout() {
      return User
       .logout()
       .$promise
       .then(function() {
         $rootScope.currentUser = null;
       });
    }

    function register(username,email, password) {
      return User
        .create({
         username: username,
         email: email,
         password: password
       })
       .$promise;
    }

    function getCurrent() {
      return User
        .getCurrent()
        .$promise
        .then(function(response){
          console.log(response,LoopBackAuth);
          $rootScope.currentUser = {
            id: response.id,
            tokenId: LoopBackAuth.accessTokenId,
            email: response.email,
            username: response.username
          }
          return response;
        });
    }

    return {
      login: login,
      logout: logout,
      register: register,
      getCurrent: getCurrent
    };
  }]);
