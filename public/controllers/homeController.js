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

        scope.getLabels = function () {
            let prop = "UL Niv ";
            refGTIN = scope.data,
                result = [];

            if (refGTIN) {
                if (angular.isArray(scope.data) && scope.data.length > 0) {
                    scope.data.forEach(function (item, index) {
                        if (index > 0) {
                            let obj = {
                                lvl1: item[prop + 1],
                                lvl2: item[prop + 2],
                                lvl3: item[prop + 3],
                                lvl4: item[prop + 4],
                                lvl5: item[prop + 5]
                            };
                            if (result.indexOf(obj) == -1) {
                                result.push(obj);
                            }
                        }
                    });
                }
            }

            console.log(result);
            return result;
        };

        scope.getXLS = function () {
            let promise = items.getXls();
            promise.then(
                function (response) {
                    let data = [];
                    console.dir(response);
                    if (Array.isArray(response.data) && response.data.length > 0) {
                        let colNames = response.data[0],
                            colNamesProperties = Object.keys(colNames);

                        response.data.forEach(function (item, i) {
                            if (i > 0) {
                                let newObj = {};
                                colNamesProperties.forEach(function (prop, j) {
                                    if (colNames[prop] != null)
                                        Object.defineProperty(newObj, colNames[prop], {
                                            _proto_: null,
                                            value: item[prop] ? item[prop] : "",
                                            writable: true,
                                            enumerable: true,
                                            configurable: true
                                        });
                                });
                                data.push(newObj);
                            }
                        });

                        scope.data = data;
                        scope.labels = scope.getLabels();
                    }
                },
                function (response) {
                    console.dir(response);
                }
            );
        };


        function GetPager(totalItems, currentPage, pageSize) {
            // default to first page
            currentPage = currentPage || 1;

            // default page size is 10
            pageSize = pageSize || 10;

            // calculate total pages
            var totalPages = Math.ceil(totalItems / pageSize);

            var startPage, endPage;
            if (totalPages <= 10) {
                // less than 10 total pages so show all
                startPage = 1;
                endPage = totalPages;
            } else {
                // more than 10 total pages so calculate start and end pages
                if (currentPage <= 6) {
                    startPage = 1;
                    endPage = 10;
                } else if (currentPage + 4 >= totalPages) {
                    startPage = totalPages - 9;
                    endPage = totalPages;
                } else {
                    startPage = currentPage - 5;
                    endPage = currentPage + 4;
                }
            }

            // calculate start and end item indexes
            var startIndex = (currentPage - 1) * pageSize;
            var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

            // create an array of pages to ng-repeat in the pager control
            var pages = _.range(startPage, endPage + 1);

            // return object with all pager properties required by the view
            return {
                totalItems: totalItems,
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                startPage: startPage,
                endPage: endPage,
                startIndex: startIndex,
                endIndex: endIndex,
                pages: pages
            };
        }

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
            switch ($location.path()) {
                case "/viko":
                    $scope.pageTitle = "VIKOSKIT";
                    break;
                case "/animate":
                    $scope.pageTitle = "MB ANIMATE";
                    break;
                default:
                    $scope.pageTitle = "TESTING APP";
                    break;
            }
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