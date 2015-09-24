/* global angular, document, window */
'use strict';

angular.module('app.controllers', [])

.controller('AppCtrl', function($scope, $state, $ionicModal, $ionicPopover, $timeout, AuthService) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };

    $scope.signout = function() {
        AuthService.logout()
        .then(function() {
          $state.go('app.signin');
        })
        .catch(function(errors){
            console.log('error',errors);
            $scope.errors = errors.data.error;
        });
    };
})

.controller('SignCtrl', function($scope, $state, $timeout, $stateParams, 
    ionicMaterialInk, ionicMaterialMotion, AuthService) {
    $scope.$parent.clearFabs();
    
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();

    /*
    $timeout(function() {
        ionicMaterialMotion.panInLeft({
            selector: '.animate-pan-in-left'
        });
    }, 500);*/

    $scope.user = {};
    $scope.errors = {};

    $scope.signin = function() {
        AuthService.login($scope.user.username, $scope.user.password)
        .then(function() {
            $scope.errors = {};
            $state.go('app.todos');
        })
        .catch(function(errors){
            console.log('error',errors);
            $scope.errors = errors.data.error;
        });
    };
    $scope.signup = function() {
        if (angular.isDefined($scope.user.password) && 
            $scope.user.password==$scope.user.password2) {
            AuthService.register($scope.user.username, $scope.user.email, $scope.user.password)
            .then(function(){
                $state.go('app.signin');
            })
            .catch(function(errors){
                console.log('error',errors);
                $scope.errors = errors.data.error;
            });
        } else {
            $scope.errors.errorCode = "401";
            $scope.errors.message = "password not match";
        }
    }
})

.controller('TodosCtrl', function($scope, $rootScope, $stateParams, $timeout, 
    $ionicActionSheet, $ionicModal, Todo, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    $scope.todos = [];
    $scope.todo = null;
    $scope.errors = {};

    $scope.load = function() {
        Todo.find({
          filter: {
            where: {
                created_by_id: $rootScope.currentUser.id
            },
            include: []
          }
        }).$promise.then(function(result){
            console.log(result);
            $scope.todos = result;
            if ($scope.todos.length>0) {
                $timeout(function() {
                    ionicMaterialMotion.fadeSlideInRight({
                        startVelocity: 3000
                    });
                }, 700);
            }
        });
    };
    //$scope.$watch('currentUser.id',function(nv,ov){
    //    if (nv) {
    //        $scope.load();
    //    }
    //});
    if (angular.isDefined($rootScope.currentUser)) {
        $scope.load();
    }

    $ionicModal.fromTemplateUrl('templates/todo-form.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.add = function() {
        $scope.todo = {};
        $scope.openModal();
    };

    $scope.delete = function(idx) {
        $scope.todos[idx].$delete()
        .then(function(){
            $scope.load();
        });
    };

    $scope.setDone = function(idx) {
        console.log('set done',idx);
        $scope.todos[idx].done = !$scope.todos[idx].done;
        if ($scope.todos[idx].done) {
            $scope.todos[idx].timedone = Date.now();
        } else {
            $scope.todos[idx].timedone = null;
        }
        $scope.todos[idx].$save()
        .then(function(result){
            $scope.todos[idx] = result;
        })
        .catch(function(errors){
            $scope.errors = errors.data.error;
        });
    };

    $scope.save = function() {
        if ($scope.todo.id) {
            console.log($scope.todo);
            $scope.todo.$save()
            .then(function(){
                $scope.closeModal();
            })
            .catch(function(errors){
                $scope.errors = errors.data.error;
            });
        } else {
            Todo.create($scope.todo).$promise
            .then(function() {
                $scope.load();
                $scope.closeModal();
            })
            .catch(function(errors){
                console.log(errors);
                $scope.errors = errors.data.error;
            });
        }
    };

    $scope.showSheet = function(idx) {
       // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: ($scope.todos[idx].done)? 'Set Undone':'Set Done' },
                { text: 'Edit' }
            ],
            destructiveText: 'Delete',
            titleText: 'Modify Your Todo',
            cancelText: 'Cancel',
            cancel: function() {
            // add cancel code..
            },
            destructiveButtonClicked: function() {
                $scope.delete(idx);
            },
            buttonClicked: function(index) {
                console.log('index: ',index);
                if (index==0) {
                    $scope.setDone(idx);
                } else if (index==1) {
                    $scope.todo = $scope.todos[idx];
                    $scope.openModal();
                }
                return true;
            }
        });

        // For example's sake, hide the sheet after two seconds
        $timeout(function() {
            hideSheet();
        }, 2500);
    };

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

;
