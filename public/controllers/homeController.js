angular.module('main')
    .controller('homeController', ['$scope', 'itemsManager', function (scope, items) {
        scope.getItems = function () {
            let promise = items.get();
            promise.then(
                function (response) {
                    scope.items = response.data;
                },
                function (response) {
                    scope.error = "Une erreur est survenue.";
                }
            );
        };

        scope.reset = function () {
            scope.items = [];
        };

        // INIT
        (function (s) {
            s.items = [];
            s.error = "";
        })(scope);

    }])

    // Jumbotron part controller
    .controller("mainHeaderController", ['$scope', '$location', function ($scope, $location) {
        (function (s) {
            s.pageTitle = $location.path() == "/viko" ? "VIKOSKIT" : "TESTING APP";
        })($scope);

        $scope.$on('changeTitle', function () {
            $scope.pageTitle = $location.path() == "/viko" ? "VIKOSKIT" : "TESTING APP";
        });

    }])

    // Navbar part controller
    .controller("navbarController", ['$scope', '$window', '$location', function ($scope, $window, $location) {

        (function (s) {
            s.getUser = function () {
                let currentUser = $window.sessionStorage.getItem('currentUser');
                if (currentUser) {
                    let regex = /\{/g;
                    return currentUser;
                }
                else {
                    return null;
                }
            };

            s.logout = function () {
                $window.sessionStorage.removeItem('currentUser');
                $location.path('/login');
            };
        })($scope);

    }]);