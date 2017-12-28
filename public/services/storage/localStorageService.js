angular.module('localStorageService', [])
    .service('localStorageManager', ['$window', function (w) {

        this.getString = function (key) {
            let item = w.localStorage.getItem(key);
            if (angular.isDefined(item)) {
                return item;
            }
            else
                return null;
        };

        this.setString = function (key, val) {
            if (typeof (val) == 'string')
                w.localStorage.setItem(key, val);
        };

        this.getObj = function (key) {
            let item = w.localStorage.getItem(key);
            if (angular.isDefined(item)) {
                return JSON.parse(item);
            }
            else
                return null;
        };

        this.setObj = function(key, val){
            let valid = typeof(val) == 'object' ? true : false;
            if(valid == true){
                w.localStorage.setItem(key, val);
            }
        };

    }]);