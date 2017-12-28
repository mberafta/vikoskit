(function () {

    const viewsPath = './views/';

    let injectables = [
        'ngRoute',
        'ngPDFViewer',
        'itemsService',
        'localStorageService',
        'uploadDirectiveApp',
        'uploadApp',
        'vikoApp',
        'login'
    ];

    const routes = {
        doc: '/document',
        pdf: '/pdf',
        home: '/',
        dice: '/dice',
        upload: '/upload',
        viko: '/viko',
        login: '/login'
    };

    angular.module('main', injectables)
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when(routes.home, {
                    controller: 'homeController',
                    templateUrl: viewsPath + 'home.html'
                })
                .when(routes.doc, {
                    controller: 'documentController',
                    templateUrl: viewsPath + 'document.html'
                })
                .when(routes.pdf, {
                    controller: 'pdfController',
                    templateUrl: viewsPath + 'pdf.html'
                })
                .when(routes.upload, {
                    controller: 'uploadController',
                    templateUrl: viewsPath + 'upload.html'
                })
                .when(routes.viko, {
                    controller: 'vikoController',
                    templateUrl: viewsPath + 'viko.html'
                })
                .when(routes.login, {
                    controller: 'loginController',
                    templateUrl: viewsPath + 'login.html'
                })
                .otherwise({
                    redirectTo: routes.home
                });
        }])

        .run(['$rootScope', '$window', function ($rootScope, $window) {

            (function () {

                let billDatas = localStorage.getItem('billDatas');
                if (!billDatas) {
                    let datas = [];
                    localStorage.setItem('billDatas', JSON.stringify(datas));
                }

                let receiptDatas = localStorage.getItem('receiptDatas');
                if (!receiptDatas) {
                    let datas = [];
                    localStorage.setItem('receiptDatas', JSON.stringify(datas));
                }

            })();

            $rootScope.$on('$routeChangeSuccess', function () {
                $rootScope.$broadcast('changeTitle');
            });
        }]);

})();





