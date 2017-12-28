angular.module('uploadApp', [])
    .controller('uploadController', ['$scope', '$http', function ($scope, $http) {

        $scope.upload = function () {
            let file = $scope.file;
            let fd = new FormData();
            fd.append('file', file);
            console.log(fd.entries().next());
            $http.post($scope.url, {id:1, fileData:file, fd:fd}).then(
                function (response) {
                    console.log(response);
                },
                function (response) {
                    console.log(response);
                }
                )
        };

        // Init
        (function (s) {
            s.url = "/api/upload"
        })($scope);

    }]);