angular.module('itemsService', [])
    .service('itemsManager', ['$http', function ($http) {

        this.get = function () {
            return $http({
                method: "get",
                url: "/api/items"
            });
        };

        this.getXls = function () {
            return $http({
                method: "get",
                url: "/api/xls"
            });
        };

    }]);