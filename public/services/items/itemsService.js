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

        this.createLabel_JAVA = function (requestObj, headersObj, serverConfiguration, isArrayBuffer) {
            let headers = headersObj,
                url = "/api/dk6", //envConfig.habilinetUrl + "dk6",
                method = "POST",
                data = {
                    requestObj: requestObj,
                    serverConfiguration: serverConfiguration
                };

            let httpObject = {
                method: method,
                url: url,
                headers: headers,
                data: data
            };

            return $http(httpObject);
        };

        this.getSequences = function () {
            var SIG_ESC = "\\x1B",
                SIG_ESP = "\\x20",
                SIG_LF = "\\x0A",
                SIG_CR = "\\x0D",
                SIG_10CPI = "\\x50",
                SIG_12CPI = "\\x4d",
                SIG_15CPI = "\\x67",
                SIG_GRAS = "\\x45",
                SIG_FINGRAS = "\\x46",
                SIG_SAUT_PAGE = "\\x0C",
                SIG_CONDENCE = "\\x0F",
                SIG_FINCONDENCE = "\\x12";


            /**
             * Séquences d'impression de d'une vignette ligne par ligne
             */

            let SEQUENCE_LIGNE_1 = [
                SIG_CR,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
                SIG_LF, SIG_CR
            ];

            let SEQUENCE_LIGNE_2 = [
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
                SIG_LF, SIG_CR
            ];

            let SEQUENCE_LIGNE_3 = [
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESC, 'X', '\\x01', '\\x10', '\\x20',
                SIG_ESP, SIG_ESP,
                '-', '-',                                   /*Type R,VD ou ORD (11)*/
                SIG_ESC, SIG_12CPI,
                SIG_ESC, '\\x03', '\\x25',
                SIG_LF, SIG_CR,
                SIG_ESC, '2'
            ];

            let SEQUENCE_LIGNE_4 = [
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESC, SIG_12CPI,
                SIG_ESP,
                ' ', ' ', ' ', ' ', ' ', ' ', ' ',           /* Recommandation (11)*/
                SIG_ESP, SIG_ESP,
                ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',        /* jour 20, mois 23, annee 26*/
                SIG_LF, SIG_CR
            ];

            let SEQUENCE_LIGNE_5 = [
                SIG_ESC, SIG_12CPI,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                ' ', ' ', ' ',                              /* HEURE (19)*/
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP, 
                SIG_ESP, SIG_ESP, SIG_ESC, SIG_GRAS,
                ' ', ' ', ' ', ' ', ' ', ' ', ' ',              /* MONTANT (27)*/
                SIG_ESP, SIG_ESP,
                'E', 'U', 'R',
                SIG_ESC, SIG_FINGRAS, SIG_ESC, SIG_12CPI,
                SIG_LF, SIG_CR
            ];

            let SEQUENCE_LIGNE_6 = [
                SIG_ESC, SIG_12CPI,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                ' ', ' ', 
                SIG_CR,                       /* Type AR ou ORD(13) */
                SIG_ESP, SIG_ESP, SIG_ESP, 
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                ' ', ' ', ' ',                               /* num gui (39) */
                SIG_ESP, SIG_ESP,
                ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 
                SIG_ESC, SIG_12CPI,          /* num post compt(44)*/
                SIG_ESP, SIG_ESP,
                SIG_ESC, SIG_GRAS,
                ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',   /* lettre priori (56) */
                ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
                SIG_ESC, SIG_FINGRAS, SIG_LF,
                SIG_CR
            ];

            let SEQUENCES = [
                {
                    index: 1,
                    value: SEQUENCE_LIGNE_1,
                    constraints: {
                        lengths: [20]
                    }
                },
                {
                    index: 2,
                    value: SEQUENCE_LIGNE_2,
                    constraints: {
                        lengths: [19]
                    }
                },
                {
                    index: 3,
                    value: SEQUENCE_LIGNE_3,
                    constraints: {
                        lengths: [11]
                    }
                },
                {
                    index: 4,
                    value: SEQUENCE_LIGNE_4,
                    constraints: {
                        lengths: [11, 8]
                    }
                },
                {
                    index: 5,
                    value: SEQUENCE_LIGNE_5,
                    constraints: {
                        lengths: [19, 27]
                    }
                },
                {
                    index: 6,
                    value: SEQUENCE_LIGNE_6,
                    constraints: {
                        lengths: [13, 39, 44, 56]
                    }
                }
            ];

            return SEQUENCES;
        };

    }]);