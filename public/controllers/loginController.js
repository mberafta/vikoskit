angular.module('login', [])
    .controller('loginController', ['$scope', '$http', '$timeout', '$location', function ($scope, $http, $timeout, $location) {

        // METHODS
        $scope.createUser = function () {
            let valid = $scope.form.$valid;
            if (valid) {
                let data = {
                    name: $scope.user.name,
                    email: $scope.user.email,
                    password: $scope.user.password
                };

                let promise = $http({
                    method: "POST",
                    url: "/api/user",
                    data: data
                });

                promise.then(
                    function (response) {
                        console.log(response.data);
                    },
                    function (response) {
                        console.log(response);
                    }
                );
            }
        };

        $scope.loginUser = function () {
            let valid = $scope.loginForm.$valid;
            if (valid) {
                let data = $scope.loginModel;
                let promise = $http({
                    method:"POST",
                    url: "/api/authenticate",
                    data: data
                });

                promise.then(
                    function(response){
                        $scope.currentUser = response.data;
                        sessionStorage.setItem('currentToken', response.data.token);
                        sessionStorage.setItem('currentUser', response.data.name);
                        $location.path('/');
                    },
                    function(response){
                        console.log(response);
                    }
                );
            }
        };

        // INIT
        (function (s) {

            // Partie register /////
            s.user = {
                name: "",
                email: "",
                password: "",
                confirmationPassword: ""
            };
            ///////////////////////

            // Partie login /////
            s.loginModel = {
                name: "",
                password: ""
            };

            s.login = false;
            s.currentUser = null;
            /////////////////////

            s.emailPattern = /\w+\-?\.?\w+?@\w+\.\w{2,3}/g;
            s.namePattern = /\w{3,}$/;

            s.form = this.userForm;
            s.loginForm = this.loginForm;
        })($scope);

    }]);