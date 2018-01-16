angular.module('mbAnimate', [])
    .controller('animateController', ['$scope', function ($scope) {

        // METHODS
        $scope.add = function () {
            let length = $scope.items.length,
                newItem = {
                    id: length,
                };

            newItem.name = "ITEM "; 
            if(length == 0)
                newItem.name += 0;
            else
                newItem.name += Number(Number(getMaxIndex()) + 1);

            $scope.items.push(newItem);
        };

        $scope.delete = function (index) {
            $scope.items.splice(index, 1);
            $scope.update();
        };

        $scope.update = function () {
            $scope.items.forEach(function (item, index) {
                item.id = index;
            });
        };

        function getMaxIndex() {
            let indexes = [];
            $scope.items.forEach(function (item, index) {
                indexes.push(item.name.match(/\d+/)[0]);
            });

            return indexes.reduce(function (a, b) { return Math.max(a, b); });
        }

        // INIT
        (function (scope) {
            scope.items = [];

            for (var j = 0; j < 3; j++) {
                let item = {
                    id: j,
                    name: "ITEM " + j
                };

                scope.items.push(item);
            }

        })($scope);

    }]);