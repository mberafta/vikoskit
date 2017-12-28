angular.module('login', [])
    .controller('loginController', ['$scope', '$http', function ($scope, $http) {
        $scope.getFBAuthentication = function () {
            $http({
                method: "GET",
                url: "/api/auth/facebook"
            }).then(
                function (r) {
                    console.log(r);
                },
                function (r) {
                    console.log(r);
                }
                );
        };

        (function (s) {
      
        })($scope);
    }]);