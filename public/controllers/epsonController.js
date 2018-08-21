angular.module('main')
    .controller('epsonController', ['$scope', 'itemsManager', function ($scope, itemsManager) {

        $scope.types = [
            "VO",
            "VR",
            "V"
        ];

        $scope.frankings = [
            { name: "LV", type: $scope.types[0] },
            { name: "LR", type: $scope.types[1] },
            { name: "VIG", type: $scope.types[2] },
            { name: "ECO", type: $scope.types[0] },
            { name: "LS", type: $scope.types[0] },
        ];

        $scope.franking = {
            value: $scope.frankings[0]
        };

        // METHODS
        $scope.epsonPrint = function () {
            let name = $scope.franking.value.name;
            let bufferObj = itemsManager.getBuffer(name);
            let type = bufferObj.type;

            let baseUrl = "http://localhost:1337/epson/print?";
            let parts = bufferObj.toPrint.split(/\s{2,}/); console.log(parts);

            let filteredExtra = bufferObj.extra.split(/\s{2,}/)[1],
                processedExtra = filteredExtra.replace(' ', '   '),
                len = processedExtra.length,
                line0, line4, line5, line6; // Ces indices correspondent aux indices des séquences

            // Analyse des composants extraits afin de déterminer la séquence de formattage
            let partsLength = parts.length;

            if (partsLength == 3) {
                type = $scope.types[2];
            }
            else {
                let isRegistered = parts[2].indexOf('Recommandée') != -1;
                if (isRegistered) {
                    type = $scope.types[1];
                }
                else {
                    type = $scope.types[0];
                }
            }

            console.log('TYPE -> ', type);

            //Cas G1 800080 ou 800000G1 800080
            if (processedExtra.length != 11)
                processedExtra = processedExtra.substr(5, len - 5);

            switch (type) {
                case $scope.types[0]: // Vignette ordinaire
                    line0 = [];
                    line4 = createLine(4, [parts[0], parts[1].replace(/\s/g, '/')]);
                    line5 = createLine(5, ['', parts[3].substr(0, parts[3].length - 6)]);
                    line6 = createLine(6, ['', '', ' ' + processedExtra, parts[2]]);
                    break;
                case $scope.types[1]: // Recommandé
                    line0 = createLine(3, "R");
                    line4 = createLine(4, [parts[0], parts[1].replace(/\s/g, '/')]);
                    line5 = createLine(5, ['', parts[3].substr(0, parts[3].length - 6)]);
                    line6 = createLine(6, ['', '', ' ' + processedExtra, parts[2]]);
                    break;
                case $scope.types[2]: // Vignette éditée manuellement
                    line0 = [];
                    line4 = createLine(4, [parts[0], parts[1].replace(/\s/g, '/')]);
                    line5 = createLine(5, ['', parts[2].substr(0, parts[2].length - 6)]);
                    line6 = createLine(6, ['', '', ' ' + processedExtra, ""]);
                    break;
                case $scope.types[3]: // Ecopli
                    line0 = [];
                    line4 = createLine(4, [parts[0], parts[1].replace(/\s/g, '/')]);
                    line5 = createLine(5, ['', parts[2].substr(0, parts[2].length - 6)]);
                    line6 = createLine(6, ['', '', ' ' + processedExtra, ""]);
                    break;
                default:
                    break;
            }

            // Concaténation des séquences de ligne pour obtenir la séquence finale à transmettre
            let processedSeq = line0.concat(line4.concat(line5.concat(line6))),
                processedSeqStr = JSON.stringify(processedSeq);

            // ########################################### 
            // ########## VIGNETTE LETTRE VERTE ##########
            // ########################################### 
            // #     R                                   #
            // #    DD         dd/MM/yy                  #
            // #                               X.YY EUR  # 
            // #             AA nnnnnn    NOM_AFFR       # 
            // ###########################################                                                     

            let encodedUrl = encodeURI(baseUrl + "buffer=" + processedSeqStr);

            let xhr = new XMLHttpRequest();
            xhr.open('GET', encodedUrl, true);
            xhr.send(null);
        }

        // PRIVATE
        function createLine(index, entries) {
            let result;
            let sequences = itemsManager.getSequences();
            let seq = [...sequences.find((s, i) => { return s.index == index; }).value];

            if (seq != null) {

                // Transformation du tableau afin de regrouper les lots d'espaces consécutifs
                // pour les considérer comme des "placeholders"
                let step = 0;
                let savedIndexes = [];
                let processedSeq = [];
                let placeHolders = [];
                seq.filter((el, n) => {
                    if (el.match(/(\S{2,})|([A-Z])/)) {
                        savedIndexes.push(n);
                    }
                });

                // Calcul de la longueur finale
                for (let i = 0; i < savedIndexes.length - 1; i++) {
                    let distance = Math.abs(savedIndexes[i + 1] - savedIndexes[i]);
                    if (distance > 1) {
                        placeHolders.push({
                            pos: savedIndexes[i] + 1, value: space(distance - 1), sequenceIndex: index
                        });
                    }
                }

                savedIndexes.forEach((si, k) => {
                    processedSeq.push(seq[si]);
                });

                placeHolders.forEach((pl, n) => {
                    let ind = savedIndexes.indexOf(pl.pos - 1);
                    if (ind != -1) {
                        let diff = Math.abs(entries[n].length - pl.value.length);
                        let isPrice = entries[n].match(/\w+\.\w+/)
                        pl.value = isPrice || index == 6 ? entries[n] : entries[n] + space(diff);
                        processedSeq.splice(ind, 0, pl.value);
                    }
                });

                result = processedSeq;
                return result;
            }
        }

        function space(n) {
            let result = "";
            for (let j = 0; j < n; j++) { result += " "; }
            return result;
        }

        // INIT
        ((s) => {



        })($scope);

    }])