/**
 * Module
 * @module httpInterceptorFactory
 */

var httpInterceptorFactory = angular.module('httpInterceptorFactory', []);

/**
 * 
 * @function httpInterceptor
 * @param {Objet} $q Gestionnaire d'asynchronisme
 * @param {Objet} $rootScope Scope global de l'application
 * @return {}
 */

httpInterceptorFactory.factory('httpInterceptor', [
    '$q',
    '$rootScope',
    function (
        $q,
        $rootScope) {

        var currentRequestsCount = 0;

        return {
            request: function (config) {
                let currentToken = sessionStorage.getItem('currentToken');
                if(currentToken){
                    console.log("token : " + currentToken);
                    config.headers['x-access-token'] = currentToken;
                }

                console.log(config);
                currentRequestsCount++;
                $rootScope.$broadcast('loaderShow');
                return config || $q.when(config);
            },
            response: function (response) {
                if ((--currentRequestsCount) == 0) {
                    $rootScope.$broadcast('loaderHide');
                }
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (!(--currentRequestsCount)) {
                    $rootScope.$broadcast('loaderHide');
                }
                return $q.reject(response);
            }
        };

    }]);


