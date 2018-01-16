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
                        if (response.data && (response.data.token && response.data.name)) {
                            setTokenAndUser(response.data.token, response.data.name);
                            $location.path('/');
                        }
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
                    method: "POST",
                    url: "/api/authenticate",
                    data: data
                });

                promise.then(
                    function (response) {
                        $scope.currentUser = response.data;
                        setTokenAndUser(response.data.token, response.data.name);
                        $location.path('/');
                    },
                    function (response) {
                        console.log(response);
                    }
                );
            }
        };

        $scope.FB_LOGIN = function(){
            FB.login(function(response){
                if(response.authResponse){
                    FB.api('/me?fields=id, name, picture', function(response){
                        console.dir(response);
                    });
                }
                else{
                    console.log('L\'opération de login n\'a pu arriver à terme.');
                }
            });
        };

        // PRIVATE
        function setTokenAndUser(token, name) {
            sessionStorage.setItem('currentToken', token);
            sessionStorage.setItem('currentUser', name);
        }

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

            s.emailPattern = /\w+\-?\.?\w+?@\w+\.\w{2,3}/;
            s.namePattern = /\w{3,}$/;

            s.form = this.userForm;
            s.loginForm = this.loginForm;
        })($scope); 

    }]);