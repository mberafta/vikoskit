angular.module('main')
    .controller('pdfController', ['$scope', 'PDFViewerService', '$http', function ($scope, pdf, $http) {

        $scope.pdfURL = "test.pdf";

        $scope.instance = pdf.Instance("viewer");
        console.dir($scope.instance);

        $scope.nextPage = function () {
            $scope.instance.nextPage();
        };

        $scope.prevPage = function () {
            $scope.instance.prevPage();
        };

        $scope.gotoPage = function (page) {
            $scope.instance.gotoPage(page);
        };

        $scope.pageLoaded = function (curPage, totalPages) {
            $scope.currentPage = curPage;
            $scope.totalPages = totalPages;
        };

        $scope.loadProgress = function (loaded, total, state) {
            console.log('loaded =', loaded, 'total =', total, 'state =', state);
        };

        (function (s) {
            s.params = { filePath: 'test.pdf' };
            var promise = $http({
                method: "get",
                url: "/api/base64/",
                params: s.params
            });

            promise.then(
                function (response) {
                    console.dir(response);
                },
                function (response) {
                    console.dir(response);
                }
            );

        })($scope);


    }]);