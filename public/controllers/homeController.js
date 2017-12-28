angular.module('main')
    .controller('homeController', ['$scope', 'itemsManager', function(scope, items){
        scope.getItems = function(){
            let promise = items.get();
            promise.then(
                function(response){
                    scope.items = response.data;
                },
                function(response){
                    scope.error = "Une erreur est survenue.";
                }
            );
        };

        scope.reset = function(){
            scope.items = [];
        };  

        // INIT
        (function(s){
            s.items = [];
            s.error = "";
        })(scope);

    }])

    .controller("mainHeaderController", ['$scope', '$location', function($scope, $location){
        (function(s){
            s.pageTitle = $location.path() == "/viko" ? "VIKOSKIT" : "TESTING APP";
        })($scope);

        $scope.$on('changeTitle', function(){
            $scope.pageTitle = $location.path() == "/viko" ? "VIKOSKIT" : "TESTING APP";
        });

    }]);