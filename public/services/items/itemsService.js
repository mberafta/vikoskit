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
                SIG_RESET = "\\x40",
                SIG_FINCONDENCE = "\\x12";

            /**
             * Séquences d'impression de d'une vignette ligne par ligne
             */

            // Lettre initiale pour les vignette R1 AR
            // "   R                       "
            let SEQUENCE_SPECIAL_CHARACTER = [
                SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP,
                '\\x1B', '\\x21', '\\x30',
                ' ',
                SIG_LF, SIG_CR
            ];

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
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESC, 'X', '\\x01', '\\x10', '\\x20',
                SIG_ESP, SIG_ESP,
                '-', '-', ' ',                                  /*Type R,VD ou ORD (11)*/
                SIG_ESC, SIG_12CPI,
                SIG_LF, SIG_CR
            ];

            // Ligne "XX        jj/MM/AA"
            let SEQUENCE_LIGNE_4 = [
                SIG_ESC, SIG_RESET,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP,
                SIG_ESC, SIG_12CPI,
                SIG_ESP,
                ' ', ' ', ' ', ' ', ' ', ' ', ' ',           /* Recommandation (11)*/
                SIG_ESP, SIG_ESP,
                ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',        /* jour 20, mois 23, annee 26*/
                SIG_LF, SIG_CR
            ];

            // Ligne "                 X.YY EUR"
            let SEQUENCE_LIGNE_5 = [
                SIG_ESC, SIG_12CPI,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                ' ', ' ', ' ',                              /* HEURE (19)*/
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESC, SIG_GRAS,
                ' ', ' ', ' ', ' ', ' ', ' ', ' ',              /* MONTANT (27)*/
                SIG_ESP,
                'E', 'U', 'R',
                SIG_ESC, SIG_FINGRAS, SIG_ESC, SIG_12CPI,
                SIG_LF, SIG_CR
            ];

            // Ligne "        XX 000000    Type_de_lettre"
            let SEQUENCE_LIGNE_6 = [
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                ' ', ' ',
                SIG_CR,                       /* Type AR ou ORD(13) */
                SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESC, SIG_10CPI,
                SIG_ESC, SIG_CONDENCE,
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                SIG_ESP, SIG_ESP, SIG_ESP,
                ' ', ' ', ' ',                               /* num gui (39) */
                SIG_ESP, SIG_ESP, SIG_ESP, SIG_ESP,
                ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
                SIG_ESC, SIG_15CPI, SIG_ESC, SIG_GRAS,
                ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',   /* lettre priori (56) */
                ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
                SIG_ESC, SIG_FINGRAS,
                SIG_ESC, SIG_FINCONDENCE,
                SIG_LF,
                SIG_CR
            ];

            let SEQUENCES = [
                {
                    index: 0,
                    value: SEQUENCE_SPECIAL_CHARACTER
                },
                {
                    index: 1,
                    value: SEQUENCE_LIGNE_1
                },
                {
                    index: 2,
                    value: SEQUENCE_LIGNE_2
                },
                {
                    index: 3,
                    value: SEQUENCE_LIGNE_3
                },
                {
                    index: 4,
                    value: SEQUENCE_LIGNE_4
                },
                {
                    index: 5,
                    value: SEQUENCE_LIGNE_5
                },
                {
                    index: 6,
                    value: SEQUENCE_LIGNE_6
                }
            ];

            return SEQUENCES;
        };

        this.getBuffer = function (name) {
            const buffers = [
                { "type": "VO", "name": "LV", "id": 32, "extra": "                            G1 800080  ", "design": "I_VO", "toPrint": "AA     25 07 18   Lettre Verte     0.95\\1B\\10" },
                { "type": "VR", "name": "LR", "id": 32, "extra": "                            80000G1 800080  ", "design": "I_VO", "toPrint": "AA     25 07 18   Lettre Recommandée     0.95\\1B\\10" },
                { "type": "V", "name": "VIG", "id": 32, "extra": "                            G1 800080  ", "design": "I_VO", "toPrint": "AA     25 07 18     0.95\\1B\\10" },
                { "type": "V", "name": "ECO", "id": 32, "extra": "                            01000G1 010080  ", "design": "I_VO", "toPrint": "CC     07 08 18                          1.56\\1B\\10" },
                { "type": "VO", "name": "LS", "id": 32, "extra": "                            01000G1 010080  ", "design": "I_VO", "toPrint": "DD     07 08 18   Lettre Suivie          2.00\\1B\\10" }
            ];

            return buffers.find((buffer) => { return buffer.name == name; });
        };

    }]);