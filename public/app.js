(function () {

    const viewsPath = './views/';

    let injectables = [
        'ngRoute',
        'ngAnimate',
        'ngPDFViewer',
        'itemsService',
        'localStorageService',
        'uploadDirectiveApp',
        'uploadApp',
        'vikoApp',
        'login',
        'httpInterceptorFactory',
        'mbAnimate'
    ];

    const routes = {
        doc: '/document',
        pdf: '/pdf',
        home: '/',
        dice: '/dice',
        upload: '/upload',
        viko: '/viko',
        login: '/login',
        animate: '/animate'
    };

    angular.module('main', injectables)
        .config([
            '$routeProvider',
            '$httpProvider',
            function (
                $routeProvider,
                $httpProvider
            ) {
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
                    .when(routes.animate, {
                        controller:'animateController',
                        templateUrl: viewsPath + 'animate.html'
                    })
                    .otherwise({
                        redirectTo: routes.home
                    });

                $httpProvider.interceptors.push('httpInterceptor');
            }])

        .run(['$rootScope', '$window', '$http', '$location', function ($rootScope, $window, $http, $location) {

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
                let currentUser = sessionStorage.getItem('currentUser');
                if (currentUser != "null") {
                    $rootScope.$broadcast('changeTitle');
                }
                else {
                    $location.path('/login');
                }
            });

            $http.defaults.headers.common['x-access-token'] = sessionStorage.getItem('currentToken') || "";
        }]);

})();

window.fbAsyncInit = function () {
    FB.init({
        appId: '1965942110333573',
        cookie: true,
        xfbml: true,
        version: '2.11'
    });

    FB.AppEvents.logPageView();

};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));





