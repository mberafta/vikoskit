angular.module('main').controller('documentController', [
    '$scope',
    'datas',
    '$http',
    'tpe',
    'itemsManager',
    function (
        $scope,
        datas,
        $http,
        tpe,
        itemsManager) {

        Array.prototype.groupBy = function (prop) {
            return this.reduce(function (groups, item) {
                var val = item[prop];
                groups[val] = groups[val] || [];
                groups[val].push(item);
                return groups;
            }, {});
        };

        String.prototype.splice = function (start, delCount, newSubStr) {
            return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
        };

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

        $scope.lengthParam = { value: 1 };

        $scope.getPdfFromHtml = function () {
            var specialElementHandlers = {
                'body': function (element, renderer) {
                    return true;
                }
            };
            var elem = document.getElementById('emailContent');
            var $elem = $('#emailContent');
            var doc = new jsPDF();
            doc.setFontSize(10);
            doc.fromHTML($elem.html(), 10, 10, {
                'width': 100, 'elementHandlers': specialElementHandlers
            });

            var b64 = doc.output('datauristring');
            var dataToPrint = {
                image: b64,
                name: 'cb.pdf',
                height: elem.clientHeight,
                orientation: 1,
                cut: 1
            };

            console.dir(dataToPrint);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://isistore.local.intra.laposte.fr:1337/Printer/PrintImage', true);
            xhr.send(JSON.stringify(dataToPrint));
        };

        $scope.tableToPdf = function () {
            var $wrapper = document.getElementById('table');
            var $wrapper2 = document.getElementById('table2');
            var height = document.getElementById('emailContent').clientHeight;
            var doc = new jsPDF('p', 'pt', [300, height]);
            var res = doc.autoTableHtmlToJson($wrapper);
            var res2 = doc.autoTableHtmlToJson($wrapper2);

            var infos = document.getElementById('infos');

            var header = function (data) {
                // INFORMATIONS PPDC (GAUCHE)
                addText(doc, 8, 'bold', 'Nom et adresse du bureau : ', 25, 30, false);
                addText(doc, 7, 'normal', '752290 - P - PARIS 17 PPDC', 25, 40, false);
                addText(doc, 7, 'normal', '27 RUE DES PENAUDES', 25, 50, false);
                addText(doc, 7, 'normal', 'F - 75017 PARIS', 25, 60, false);
                addText(doc, 7, 'normal', 'FRANCE', 25, 70, false);
                addText(doc, 8, 'bold', 'Tél : 0140543710', 25, 80, false);
                addText(doc, 8, 'bold', 'Date 31/08/2017', 25, 90, false);

                // INFORMATIONS CLIENT (DROITE)
                addText(doc, 8, 'bold', 'N° Facture ', 185, 30, false);
                addText(doc, 7, 'normal', 'Le 31/08/2017', 185, 40, false);
                addText(doc, 7, 'bold', 'Entreprise client:', 185, 50, false);
                addText(doc, 7, 'normal', 'SYND INTER COM VDCAT SCOLA CHAPE FAUCHER', 185, 60, true);
                addText(doc, 7, 'bold', 'Adresse du siege social:', 185, 80, false);
                addText(doc, 7, 'normal', 'F-24530 LA CHAPELLE FAUCHER FRANCE', 185, 90, true);
            };

            var options = {
                theme: 'grid',
                addPageContent: header,
                margin: {
                    left: 30
                },
                startY: 120,
                styles: {
                    fontSize: 6,
                    fontStyle: 'bold'
                },
            };

            doc.autoTable(res.columns, res.data, options);

            var pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
            var previousPageCount = doc.autoTable.previous.pageCount;

            doc.setPage(1 + pageNumber - previousPageCount);

            var options2 = {
                theme: 'grid',
                margin: {
                    left: 30
                },
                startY: doc.autoTable.previous.finalY + 10,
                styles: {
                    fontSize: 6,
                    fontStyle: 'bold'
                },
                showHeader: 'firstPage',
            };

            doc.autoTable(res2.columns, res2.data, options2);

            var footerText1 = 'La poste - Société anonyme au capital de 3 800 000 000 euros - 356 000 000 RCS PARIS';
            var footerText2 = 'Siège social 9 rue du Colonel Pierre AVIA - 75757 PARIS CEDEX 15';
            var footerText3 = 'N de TVA intra-communautaire : FR 39 356 000 000 - ICS N°FR93COU111341';

            addText(doc, '6', 'bold', footerText1, 25, doc.autoTable.previous.finalY + 30, false);
            addText(doc, '6', 'bold', footerText2, 45, doc.autoTable.previous.finalY + 37, false);
            addText(doc, '6', 'bold', footerText3, 32, doc.autoTable.previous.finalY + 44, false);

            doc.save("cb.pdf");

            var b64 = doc.output('datauristring');
            var dataToPrint = {
                image: b64,
                name: 'cb.pdf',
                height: 100 + document.getElementById('emailContent').clientHeight,
                orientation: 1,
                cut: 1
            };

            console.dir(dataToPrint);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://isistore.local.intra.laposte.fr:1337/Printer/PrintImage', true);
            xhr.send(JSON.stringify(dataToPrint));
        };

        /**
         * Fonction principale générant les tableaux à fournir à jsPDF
         * @function getDocumentFromOrder
         * @param {object} order
         * @param {object} vacationInfos
         * @param {string} ppdc
         */
        $scope.getDocumentFromOrder = function () {

            // Paramètres géométriques
            let offset = 8, // paramètre d'écart unitaire
                posX = 35, // position initiale en abscisse
                posY = 45, // position initiale en ordonnée
                d_th = 2 * offset, // écart bloc header - bloc tableaux
                d_ft = 3 * offset; // écart bloc tableaux - bloc footer
            // variables contenant les informations de facture
            let vacationInfos = datas.vacationInfos(),
                order = datas.order().data,
                ppdc = datas.ppdc();

            console.log('LONGUEUR DE ORDER LIGNES_COMMANDES : ' + order.lignesCommandes.length);

            let tvaTables = []; // On y stockera chaque tableau du DOM

            // Structure des tableaux
            let orderColumns = ['Libellé', 'Qté', 'PU HT', 'TVA', 'TOTAL HT'],
                orderColumnsTVA0 = ['Libellé', 'Qté', '', '', 'Net de taxe'],
                tvaColumns = ['', 'Total net HT', 'Taux TVA', 'Montant TVA', 'Montant TTC'],
                tvaColumns0 = ['', '', '', '', 'Total net de taxe'];

            // Groupes par TVA
            let groups = getOrderTvaGroups(order); // Formation des tableaux de produits regroupés par TVA
            let keys = Object.keys(groups); // Chaque clé est une propriété qui contient un groupe de produits pour une TVA donée

            keys.forEach(function (k, i) {
                // Éléments initiaux
                // Pour les futurs tableaux de produits et de tva
                let orderTable = document.createElement('table'),
                    orderHead = document.createElement('thead'),
                    orderBody = document.createElement('tbody'),
                    orderFoot = document.createElement('tfoot');

                // Paramètres css
                orderTable.style.tableLayout = "fixed";
                orderTable.style.width = "380px";

                (function (ind) {
                    var tr = document.createElement('tr');
                    let columns = groups[k][0].TVA == 0.0 ? orderColumnsTVA0 : orderColumns;
                    // Ajout des en-têtes de colonnes du tableau
                    columns.forEach(function (value, index) {
                        var newTd = document.createElement('th');
                        newTd.style.fontSize = "7px";
                        newTd.innerHTML = value;
                        tr.appendChild(newTd);
                    });

                    orderHead.appendChild(tr);
                    // Ajout du bloc thead au tableau
                    orderTable.appendChild(orderHead);

                    // Alimentation du body de orderTable
                    groups[k].forEach(function (val, index) {
                        var tr = document.createElement('tr'),
                            td1 = document.createElement('td'),
                            td2 = document.createElement('td'),
                            td3 = document.createElement('td'),
                            td4 = document.createElement('td'),
                            td5 = document.createElement('td');

                        td1.innerHTML = val.article.libelle;
                        td1.style.wordWrap = "break-word";

                        if (groups[k][0].TVA != 0) {
                            td3.innerHTML = val.montantHT + ' €';
                            td4.innerHTML = val.article.tauxTVA / 100;
                        }

                        td2.innerHTML = 1;
                        td5.innerHTML = val.montantHT + ' €';

                        // Taille des polices
                        td1.style.fontSize = "7px";
                        td2.style.fontSize = "7px";
                        td3.style.fontSize = "7px";
                        td4.style.fontSize = "7px";
                        td5.style.fontSize = "7px";

                        tr.appendChild(td1);
                        tr.appendChild(td2);
                        tr.appendChild(td3);
                        tr.appendChild(td4);
                        tr.appendChild(td5);

                        orderBody.appendChild(tr);
                    });

                    // Ajout du corps au tableau
                    orderBody.appendChild(document.createElement('tr'));
                    orderTable.appendChild(orderBody);

                    // Création du footer
                    var foot_tr1 = document.createElement('tr'); // Ligne des en-têtes des éléments du footer
                    var foot_tr2 = document.createElement('tr'); // Lignes des valeurs associées aux en-têtes
                    var footerColumns = groups[k][0].TVA == 0 ? tvaColumns0 : tvaColumns;
                    footerColumns.forEach(function (tc, i) {
                        var newTd = document.createElement('td');
                        newTd.innerHTML = tc;
                        foot_tr1.appendChild(newTd);
                    });

                    orderFoot.appendChild(foot_tr1);

                    let tr2_td1 = document.createElement('td'),
                        tr2_td2 = document.createElement('td'),
                        tr2_td3 = document.createElement('td'),
                        tr2_td4 = document.createElement('td'),
                        tr2_td5 = document.createElement('td');

                    // Taille des polices (important)
                    tr2_td1.style.fontSize = "7px";
                    tr2_td2.style.fontSize = "7px";
                    tr2_td3.style.fontSize = "7px";
                    tr2_td4.style.fontSize = "7px";
                    tr2_td5.style.fontSize = "7px";

                    // Si TVA non égale à 0, alors on ajoute les calculs relatifs à la TVA
                    if (groups[k][0].TVA != 0) {
                        tr2_td2.innerHTML = Number(getSubTotalHT(groups[k])) + ' €'; // Total net HT
                        tr2_td3.innerHTML = groups[k][0].TVA / 100; // Taux TVA
                        tr2_td4.innerHTML = getTvaTotal(groups[k]) + ' €'; // Montant TVA
                    }

                    // Montant total TTC ou Total net de taxe
                    tr2_td5.innerHTML = Number(getSubTotalHT(groups[k])) + Number(getTvaTotal(groups[k])) + ' €'; // Montant TTC

                    foot_tr2.appendChild(tr2_td1);
                    foot_tr2.appendChild(tr2_td2);
                    foot_tr2.appendChild(tr2_td3);
                    foot_tr2.appendChild(tr2_td4);
                    foot_tr2.appendChild(tr2_td5);

                    orderFoot.appendChild(foot_tr2);
                    orderTable.appendChild(orderFoot);
                    // -------------------------------------------------------------

                    orderTable.setAttribute('id', 'table-' + ind);
                    orderTable.style.position = 'absolute';
                    orderTable.style.left = "-999px";
                    document.body.appendChild(orderTable);
                    tvaTables.push(document.getElementById('table-' + ind));
                })(i);
            });

            // Ajout du tableau final pour indiquer le TOTAL TTC sur l'ensembles des tableaux
            let finalTable = document.createElement('table'),
                finalTableHead = document.createElement('thead'),
                finalTableBody = document.createElement('tbody'),
                finalTableColumns = ['', '', '', '', 'MONTANT TOTAL TTC'],
                finalTable_tr1 = document.createElement('tr'),
                finalTable_tr2 = document.createElement('tr');

            // Création de l'en-tête du tableau final + création de la ligne correspondante
            finalTableColumns.forEach(function (ftc, i) {
                let tr1_th = document.createElement('th'),
                    tr2_td = document.createElement('td'),
                    len = finalTableColumns.length;

                tr1_th.innerHTML = ftc;
                tr1_th.style.textAlign = 'right';
                tr2_td.style.textAlign = 'right';
                tr1_th.style.fontSize = "7px";
                tr2_td.style.fontSize = "7px";

                if (i == len - 1) {
                    tr2_td.innerHTML = order.montantTotal + ' €';
                }

                finalTable_tr1.appendChild(tr1_th);
                finalTable_tr2.appendChild(tr2_td);
            });

            // Construction du tableau final + ajout à la liste des tableaux
            finalTableHead.appendChild(finalTable_tr1);
            finalTable.appendChild(finalTableHead);

            finalTableBody.appendChild(finalTable_tr2);
            finalTable.appendChild(finalTableBody);

            // Positionnement sur une zone invisible pour obtenir une dimension physique
            finalTable.setAttribute('id', 'table-final');
            //finalTable.style.position = 'absolute';
            //finalTable.style.left = "-999px";
            document.body.appendChild(finalTable);
            tvaTables.push(document.getElementById('table-final'));

            // Bloc informations ppdc (en haut à gauche)
            let ppdcInfos = {
                label: new field('Nom et adresse du bureau:', 'bold', 7),
                line1: function () {
                    var str = vacationInfos.site.regate + ' - P - ' + ppdc;
                    return new field(str, 'normal', 6);
                },
                line2: function () {
                    var str = vacationInfos.site.adresse2 && vacationInfos.site.adresse4 ?
                        vacationInfos.site.adresse2 + ' ' + vacationInfos.site.adresse4 : '';
                    return new field(str, 'normal', 6);
                },
                line3: function () {
                    var str = 'F - ';
                    str += vacationInfos.site.cp + ' ' + vacationInfos.site.ville;
                    return new field(str, 'normal', 6);
                },
                line4: new field('FRANCE', 'normal', 6),
                line5: new field('Date de vente ' + new Date().toLocaleDateString(), 'bold', 6)
            };

            // Infos facture + client
            let docInfos = {
                line1: new field('N° Facture', 'bold', 7),
                line2: new field(order.identifiant, 'normal', 6),
                line3: new field('Date d\'émission ' + new Date().toLocaleDateString(), 'normal', 7),
                line4: new field('Date de réglement ' + order.dateVente, 'normal', 7),
                line5: new field('Nom du client entreprise', 'bold', 6),
                line6: new field(order.client.nom, 'normal', '7'),
                line7: new field('Adresse du siège social du client', 'bold', 6),
                line8: new field(order.client.adresse.codePostal + ' ' + order.client.adresse.ville, 'normal', 7),
                line9: new field('FRANCE', 'normal', 6),
                line10: new field('N° Siret : ' + order.client.siret, 'normal', 6),
                line11: new field('N° Coclico : ' + order.client.coclico, 'normal', 6),
                line12: new field('N° Carte Pro : ' + order.client.cartePro, 'normal', 6)
            };

            // document
            var headerHeight = (12 * 12 + 13 * 1.15 + 10), // 12 Lignes en taille 7, 13 interlignes (avec celle du haut et celle du bas), offset de padding : 10
                footerHeight = (3 * 12 + 4 * 1.15 + 10), // Même principe que ci-dessus
                N = order.lignesCommandes.length,
                totalHeight = (getTotalHeight(tvaTables, offset) + (headerHeight + footerHeight)) * 1.15 * approximate(N / 100, N), // (1.0/3.25)*(0.9)*0.85
                intermecAPI_height = totalHeight * 3,
                docWidth = 350,
                mid = (docWidth) / 2,
                doc = new jsPDF('p', 'pt', [docWidth, totalHeight]); // (totalHeeight - 200) / 0.5

            let ls = localStorage,
                _datas = JSON.parse(ls.getItem('billDatas'));

            let newData = {
                length: order.lignesCommandes.length,
                sizeCorrector: approximate(N / 100, N) * 1.15,
                headerHeight: headerHeight,
                footerHeight: footerHeight,
                totalHeight: getTotalHeight(tvaTables, offset) + footerHeight + headerHeight,
                jspdfHeight: totalHeight
            };

            let existingData = _datas.find(function (d) { return d.length == newData.length });
            if (existingData == null) {
                _datas.push(newData);
            }

            $scope.billDatas = _datas;

            ls.setItem('billDatas', JSON.stringify(_datas));

            // Positionnement du bloc informations
            var ppdcFields = Object.keys(ppdcInfos);
            ppdcFields.forEach(function (f, i) {
                var data = angular.isFunction(ppdcInfos[f]) ? ppdcInfos[f]() : ppdcInfos[f];
                addText(doc, data.fSize, data.fStyle, data.value, posX, posY + i * offset, false);
            });

            // Positionnement du bloc client
            addText(doc, docInfos.line1.fSize, docInfos.line1.fStyle, docInfos.line1.value, mid + 10, posY, false);
            addText(doc, docInfos.line2.fSize, docInfos.line2.fStyle, docInfos.line2.value, mid + 10, posY + offset, false);
            addText(doc, docInfos.line3.fSize, docInfos.line3.fStyle, docInfos.line3.value, mid + 10, posY + 3 * offset, false);
            addText(doc, docInfos.line4.fSize, docInfos.line4.fStyle, docInfos.line4.value, mid + 10, posY + 4 * offset, false);
            addText(doc, docInfos.line5.fSize, docInfos.line5.fStyle, docInfos.line5.value, mid + 10, posY + 6 * offset, false);
            addText(doc, docInfos.line6.fSize - 1, docInfos.line6.fStyle, docInfos.line6.value, mid + 10, posY + 7 * offset, false);
            addText(doc, docInfos.line7.fSize, docInfos.line7.fStyle, docInfos.line7.value, mid + 10, posY + 9 * offset, false);
            addText(doc, docInfos.line8.fSize - 1, docInfos.line8.fStyle, docInfos.line8.value, mid + 10, posY + 10 * offset, true, 145);

            if (order.client.siret != null)
                addText(doc, docInfos.line10.fSize, docInfos.line10.fStyle, docInfos.line10.value, mid + 10, posY + 13 * offset, false);

            if (order.client.coclico != null)
                addText(doc, docInfos.line11.fSize, docInfos.line11.fStyle, docInfos.line11.value, mid + 10, posY + 14 * offset, false);

            if (order.client.cartePro != null)
                addText(doc, docInfos.line12.fSize, docInfos.line12.fStyle, docInfos.line12.value, mid + 10, posY + 15 * offset, false);

            // Création du tableau jsPDF des produits perméttant le calcul de la hauteur du futur doc
            getAutoTables(doc, tvaTables, offset, posX, posY + 135);

            // Intégration du footer de facture
            var footerText1 = 'La poste - Société anonyme au capital de 3 800 000 000 euros - 356 000 000 RCS PARIS';
            var footerText2 = 'Siège social 9 rue du Colonel Pierre AVIA - 75757 PARIS CEDEX 15';
            var footerText3 = 'N de TVA intra-communautaire : FR 39 356 000 000 - ICS N°FR93COU111341';

            addText(doc, '6', 'bold', footerText1, 40, doc.autoTable.previous.finalY + 3 * offset + 10, false);
            addText(doc, '6', 'bold', footerText2, 60, doc.autoTable.previous.finalY + 4 * offset + 10, false);
            addText(doc, '6', 'bold', footerText3, 53, doc.autoTable.previous.finalY + 5 * offset + 10, false);

            var b64 = doc.output('datauristring');
            var dataToPrint = {
                image: b64,
                name: 'cb.pdf',
                height: intermecAPI_height,
                orientation: 1,
                cut: 1
            };

            console.log('POSITION DU PIED DU DERNIER TABLEAU : ' + doc.autoTable.previous.finalY);

            doc.save('fact.pdf');

            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://isistore.local.intra.laposte.fr:1338/Printer/PrintImage', true);
            xhr.send(JSON.stringify(dataToPrint));
        };

        $scope.getReceipt = function () {
            let ppdc = datas.ppdc(), order = datas.order().data, vacationInfos = datas.vacationInfos();
            let result;
            let container = document.createElement('div'),
                textNodes = [],
                length = order.lignesCommandes ? order.lignesCommandes.length > 0 ? order.lignesCommandes.length : 0 : 0;

            let groups = getOrderTvaGroups(order); // Formation des tableaux de produits regroupés par TVA
            let keys = Object.keys(groups); // Chaque clé est une propriété qui contient un groupe de produits pour une TVA donée
            let groupsArray = [];

            keys.forEach(function (key, index) {
                groupsArray.push(groups[key]);
            });

            let globalTvaSum = getGlobalTvaSum(groupsArray);

            // Attribution d'un id au container afin de le récupérer après intégration dans le contenu HTML
            container.setAttribute('id', 'receipt');

            let headerTable = document.createElement('table'),
                bodyTable = document.createElement('table'),
                footerTable = document.createElement('table'),
                stripe = '-------------------------------------',
                main_title = 'TICKET DE CAISSE',
                main_info1 = 'LA POSTE',
                main_info2 = ppdc,
                footer_info1 = ['TYPE PAIEMENT', ' : ', 'CB'],
                footer_info2 = ['TOTAL PAYÉ', ' : ', order.montantTotal + ' EUR'],
                footer_info3 = ['DONT TVA', ' : ', globalTvaSum],
                final_info1 = 'MERCI ET A BIENTOT',
                body_title = 'DÉTAIL DE LA COMMANDE';

            // Affectation de la taille de police des tableaux
            headerTable.style.fontSize = "9px;";
            footerTable.style.fontSize = "9px;";
            bodyTable.style.fontSize = "9px;";

            createTextNode(main_title, container);
            createTextNode(stripe, container);
            createTextNode(main_info1, container);
            createTextNode(main_info2, container);
            createTextNode(stripe, container);

            // Header du ticket de caisse
            let head_tr1 = document.createElement('tr'),
                head_tr2 = document.createElement('tr'),
                head_tr3 = document.createElement('tr');

            (function () {
                let d = new Date();
                let minutes = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
                let seconds = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
                let longDate = d.toLocaleDateString() + ' à ' + d.getHours() + ':' + minutes + ':' + seconds;
                createTableLine(['Edité le ', ': ', longDate], head_tr1);
                createTableLine(['N° de commande ', ': ', order.identifiant], head_tr2);
                createTableLine(['Automate ', ': ', 'ISI STORE 1'], head_tr3);
                headerTable.appendChild(head_tr1);
                headerTable.appendChild(head_tr2);
                headerTable.appendChild(head_tr3);
            })();

            container.appendChild(headerTable);

            // Body du ticket de caisse
            createTextNode(stripe, container);
            createTextNode(body_title, container);

            (function () {
                for (var k = 0; k < order.lignesCommandes.length; k++) {
                    var new_tr = document.createElement('tr');
                    var line = order.lignesCommandes[k];
                    createTableLine(['1 ' + line.article.libelle, ':', Number(Number(line.montantHT * (1 + (line.article.tauxTVA / 100))).toFixed(3)).toFixed(2) + ' EUR'], new_tr);
                    bodyTable.appendChild(new_tr);
                }
            })();

            container.appendChild(bodyTable);

            createTextNode(stripe, container);
            // Footer du ticket de caisse
            (function () {
                let foot_tr1 = document.createElement('tr'),
                    foot_tr2 = document.createElement('tr'),
                    foot_tr3 = document.createElement('tr');

                createTableLine(footer_info1, foot_tr1);
                createTableLine(footer_info2, foot_tr2);
                createTableLine(footer_info3, foot_tr3);

                footerTable.appendChild(foot_tr1);
                footerTable.appendChild(foot_tr2);
                footerTable.appendChild(foot_tr3);
                container.appendChild(footerTable);
            })();

            // Création de l'élément physique afin d'obtenir ses dimensions
            createTextNode(stripe, container);
            createTextNode(final_info1, container);

            document.getElementById('main').appendChild(container);
            let receiptDomElement = document.getElementById('receipt');

            (function (domElement, header, body, footer, main) {
                console.dir(domElement);
                let posX = 55,
                    posY = 65,
                    offset = 7,
                    N = order.lignesCommandes.length,
                    corrector = getReceiptSizeCorrector(order.lignesCommandes.length),
                    totalHeight = (domElement.offsetHeight + 2 * posY) * 0.9, // 0.75 pt par pixel,
                    experimentalHeight = posY + (17 * offset) + N * (2.5 * 8 + 3.5 * 1.15 + offset) + posY + (N + 1) * offset,
                    sizeMin = '6', sizeMax = '7',
                    doc = new jsPDF('p', 'pt', [300, experimentalHeight]);

                doc.setFont('courier');

                // 2 premiers champs du header
                addText(doc, sizeMax, 'bold', domElement.childNodes[0].innerHTML, posX + 50, posY, false);
                addText(doc, sizeMax, 'bold', domElement.childNodes[1].innerHTML, posX, posY + 2 * offset, false);
                addText(doc, sizeMax, 'bold', domElement.childNodes[2].innerHTML, posX, posY + 4 * offset, false);
                addText(doc, sizeMax, 'bold', domElement.childNodes[3].innerHTML, posX, posY + 5 * offset, false);
                addText(doc, sizeMax, 'bold', domElement.childNodes[4].innerHTML, posX, posY + 7 * offset, false);

                // Tableau du header
                addText(doc, sizeMax, 'bold', domElement.childNodes[5].childNodes[0].childNodes[0].innerHTML, posX, posY + 9 * offset, false);
                addText(doc, sizeMax, 'bold', domElement.childNodes[5].childNodes[0].childNodes[1].innerHTML, posX + 75, posY + 9 * offset, false);
                addText(doc, sizeMax, 'bold', domElement.childNodes[5].childNodes[0].childNodes[2].innerHTML, posX + 90, posY + 9 * offset, false);
                addText(doc, sizeMax, 'bold', domElement.childNodes[5].childNodes[1].childNodes[0].innerHTML, posX, posY + 10 * offset, false);
                addText(doc, sizeMax, 'bold', domElement.childNodes[5].childNodes[1].childNodes[1].innerHTML, posX + 75, posY + 10 * offset, false);
                addText(doc, sizeMax, 'bold', domElement.childNodes[5].childNodes[1].childNodes[2].innerHTML, posX + 90, posY + 10 * offset, false);
                addText(doc, sizeMax, 'bold', domElement.childNodes[5].childNodes[2].childNodes[0].innerHTML, posX, posY + 11 * offset, false);
                addText(doc, sizeMax, 'bold', domElement.childNodes[5].childNodes[2].childNodes[1].innerHTML, posX + 75, posY + 11 * offset, false);
                addText(doc, sizeMax, 'bold', domElement.childNodes[5].childNodes[2].childNodes[2].innerHTML, posX + 90, posY + 11 * offset, false);

                // Séparateur header-body + titre du body
                addText(doc, sizeMax, 'bold', domElement.childNodes[6].innerHTML, posX, posY + 13 * offset, false);
                addText(doc, sizeMax, 'bold', domElement.childNodes[7].innerHTML, posX + 35, posY + 15 * offset, false);

                let footer_startY = 0;
                let body_startY = posY + 17 * offset;

                for (let i = 0; i < bodyTable.childNodes.length; i++) {
                    var h = 0;
                    var element = i > 0 ? domElement.childNodes[8].childNodes[i - 1].childNodes[0] : null;
                    if (element != null) {
                        let text = element.innerHTML,
                            textLen = text.length,
                            textLines = (textLen % 20 == 0) ? (textLen / 20) : ((textLen - textLen % 20) / 20) + 1,
                            textMargin = 1.15;

                        body_startY += ((textLines * sizeMax) + (textLines + 1) * textMargin) + offset;
                    }

                    for (let j = 0; j < 3; j++) {
                        var text = domElement.childNodes[8].childNodes[i].childNodes[j].innerHTML;
                        var offsetX = 0;
                        if (j == 1) {
                            let previousText = domElement.childNodes[8].childNodes[i].childNodes[j - 1].innerHTML;
                            offsetX += 115;
                        }
                        if (j == 2) {
                            let previousText = domElement.childNodes[8].childNodes[i].childNodes[j - 2].innerHTML;
                            offsetX += 125;
                        }

                        addText(doc, sizeMin, 'bold', text, posX + offsetX, body_startY, true);

                        if ((bodyTable.childNodes.length >= 2 && i == bodyTable.childNodes.length - 2)
                            || (bodyTable.childNodes.length == 1)) {
                            footer_startY = body_startY;
                        }
                    }
                }

                // Séparateur entre body et footer
                addText(doc, sizeMax, 'bold', domElement.childNodes[9].innerHTML, posX, posY + footer_startY, false);

                // Teblaeu du footer
                let footer_table_startY = posY + footer_startY + domElement.childNodes[9].clientHeight - offset;
                let final_info_startY = 0;
                for (var i = 0; i < footerTable.childNodes.length; i++) {
                    var h = 0;
                    if (i >= 1) {
                        h = domElement.childNodes[10].childNodes[i - 1].childNodes[0].clientHeight;
                    }
                    for (var j = 0; j < 3; j++) {
                        var text = domElement.childNodes[10].childNodes[i].childNodes[j].innerHTML;
                        var offsetX = 0;
                        if (j == 1) {
                            offsetX += 111;
                        }
                        if (j == 2) {
                            offsetX += 125;
                        }
                        addText(doc, sizeMin, 'bold', text, posX + offsetX, footer_table_startY + i * offset, true);

                        if (i == footerTable.childNodes.length - 1) {
                            final_info_startY = footer_table_startY + (i + 2) * offset;
                        }
                    }
                }

                addText(doc, sizeMax, 'bold', domElement.childNodes[11].innerHTML, posX, final_info_startY, false);
                addText(doc, sizeMax, 'bold', domElement.childNodes[12].innerHTML, posX + 45, final_info_startY + 2 * offset, false);

                let ls = localStorage,
                    _datas = JSON.parse(ls.getItem('billDatas'));

                let newData = {
                    length: order.lignesCommandes.length,
                    sizeCorrector: approximate2(N),
                    headerHeight: header.clientHeight,
                    bodyHeight: body.clientHeight,
                    footerHeight: footer.clientHeight,
                    mainHeight: main.clientHeight,
                    totalHeight: domElement.clientHeight,
                    jspdfHeight: totalHeight,
                    finalStartY: final_info_startY + 4 * offset
                };

                let existingData = _datas.find(function (d) { return d.length == newData.length });
                if (existingData == null) {
                    _datas.push(newData);
                }

                $scope.billDatas = _datas;

                ls.setItem('billDatas', JSON.stringify(_datas));

                var b64 = doc.output('datauristring');
                var dataToPrint = {
                    image: b64,
                    name: 'cb.pdf',
                    height: experimentalHeight * 2.75, // (totalHeight + 2 * 240) * 1.15 + 100
                    orientation: 1,
                    cut: 1
                };

                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://isistore.local.intra.laposte.fr:1338/Printer/PrintImage', true);
                xhr.send(JSON.stringify(dataToPrint));
                doc.save('ticket.pdf');

                // result = $http({
                //     method: 'POST',
                //     url: 'https://isistore.local.intra.laposte.fr:1337/Printer/PrintImage',
                //     data: dataToPrint
                // });

                document.body.removeChild(domElement);

            })(receiptDomElement, headerTable, bodyTable, footerTable, container);

            return null;
        };

        $scope.getTicketCB = function () {
            var doc = new jsPDF('p', 'pt', [300, 330]);
            var width = doc.internal.pageSize.width,
                height = doc.internal.pageSize.height,
                startY = 20,
                offsetY = 10;

            var url = 'ctls.jpg';
            var image = new Image();
            image.src = url;

            image.onload = function () {
                let img = this;
                var tpePromise = tpe.pay();
                tpePromise.then(
                    function (response) {
                        if (response.data.Result) {
                            let ticketCB = response.data.Result.Ticket || ticket;
                            let strParts = ticketCB.split('\n');
                            let startIndex = 4;
                            let posX = 30, posY = 30, offSetY = 4, startY = posY + 20;
                            if (strParts.length > 0) {
                                let hasImage = strParts[startIndex].match('(% img \'ctls.png\' %)') ? true : false;
                                if (hasImage) {
                                    doc.addImage(img, 'JPEG', posX + 70, posY, 90, 25);
                                }
                                else {
                                    addText(doc, 9, 'bold', 'CARTE BANCAIRE', posX + 70, startY, false);
                                }

                                for (var k = startIndex + 1; k < strParts.length; k++) {
                                    addText(doc, 9, 'bold', strParts[k], posX + 50, startY + 10 + (k - 3) * offsetY, false);
                                }
                            }

                            doc.save('x.pdf');

                            var b64 = doc.output('datauristring');
                            var dataToPrint = {
                                image: b64,
                                name: 'cb.pdf',
                                height: 200,
                                orientation: 1,
                                cut: 1
                            };

                            var xhr = new XMLHttpRequest();
                            xhr.open('POST', 'https://isistore.local.intra.laposte.fr:1337/Printer/PrintImage', true);
                            xhr.send(JSON.stringify(dataToPrint));

                        }
                    },
                    function (response) {

                    }
                );

            }
        };

        $scope.epsonPrint = function () {
            let name = $scope.franking.value.name;
            let bufferObj = itemsManager.getBuffer(name);
            let type = bufferObj.type;

            let baseUrl = "http://localhost:1337/epson/print?";
            let parts = bufferObj.toPrint.split(/\s{2,}/); console.log(parts);

            let filteredExtra = bufferObj.extra.split(/\s{2,}/)[1],
                processedExtra = filteredExtra.replace(' ', '   '),
                len = processedExtra.length,
                line0, line4, line5, line6;

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

        function getCurrentTime() {
            let minutes = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
            return new Date().getHours() + ':' + minutes + ':' + new Date().getSeconds();
        }

        function getDivider(length) {
            let result = length == 1 ? 1 : 1 + (length - 1) * 0.05;
            return result;
        }

        /**
         * Fonction perméttant de déterminer un coefficient de correction de la taille du pdf à créer
         * @function getReceiptSizeCorrector
         * @param {number} len 
         */
        function getReceiptSizeCorrector(len) {
            let result,
                modulo = len % 10;

            if (modulo == 0) {
                result = len / 10;
            }
            else {
                result = ((len - modulo) / 10) + 1;
            }

            return result;
        }

        function getGlobalTvaSum(groups) {
            var valid = Array.isArray(groups) ? groups.length > 0 ? true : false : false,
                result = 0;
            if (valid) {
                groups.forEach(function (g, i) {
                    result += getTvaTotal(g);
                    console.log('TVA TOTAL - étape ' + i + ' : ' + result);
                });
            }
            return Number(result).toFixed(2);
        }

        function getReceiptLine(orderLine) {
            var str = '';
            if (orderLine.article) {
                let art = orderLine.article;
                str += '1 ' + art.libelle + '        : ' + article.montantHT + ' EUR';
            }
            return str;
        }

        function createTextNode(_innerHTML, _container) {
            var valid = typeof (_container) == 'HTMLDivElement' ? true : false;
            let text_node = document.createElement('p');
            text_node.innerHTML = _innerHTML;
            text_node.style.fontSize = "8pt";
            _container.appendChild(text_node);
        }

        function createTableLine(values, _tr) {
            if (values.length > 0) {
                values.forEach(function (val, i) {
                    let td = document.createElement('td');
                    td.style.fontSize = "7pt";
                    td.style.wordBreak = 'normal';
                    td.style.wordWrap = 'break-word';
                    if (i == values.length - 1) {
                        td.style.textAlign = 'right';
                    }
                    td.innerHTML = val;
                    _tr.appendChild(td);
                });
            }
        }

        /**
         * Hauteur totale de la liste des tableaux
         * @param {table} tableList
         * @param {number} offset
         */
        function getTotalHeight(tableList, offset) {
            var result = 0;
            var length = tableList.length;
            if (length > 0) {
                for (var i = 0; i < length; i++) {
                    if (tableList[i].clientHeight) {
                        var cl = tableList[i].clientHeight;
                        console.log('Tableau ' + i + ' : ' + cl + ' px \n');
                        if (i == 0)
                            result += cl;
                        else
                            result += (cl + offset);
                    }
                }
            }
            console.log('\n TOTAL HEIGHT : ' + result + '\n');
            return result;
        }

        /**
         * Fonction perméttant d'obtenir les groupes d'articles commandés par taux de TVA
         * @param {Object} ord
         */
        function getOrderTvaGroups(ord) {
            var temp = [], groups;
            var valid = ord.lignesCommandes ? ord.lignesCommandes.length > 0 ? true : false : false;
            if (valid) {
                var len = ord.lignesCommandes.length;
                for (var i = 0; i < len; i++) {
                    let ordLine = ord.lignesCommandes[i];
                    let resultLine = ordLine;
                    resultLine.TVA = ordLine.article.tauxTVA;
                    temp.push(resultLine);
                }

                groups = temp.groupBy('TVA');
            }
            return groups;
        };

        /**
         * Fonction perméttant d'arrondir un nombre réel à la seconde décimale
         *
         * @function roundNumber
         * @param {number} number
         */
        function roundNumber(number) {
            console.log('Entrée ' + number);
            var numberParts = (number * 100).toString().split('.');
            if (numberParts.length > 1) {
                var decimalPart = numberParts[1];
                if (parseInt(decimalPart.charAt(0)) > 5) {
                    number = Math.ceil((number * 100)) / 100;
                }
                else {
                    number = Math.floor((number * 100)) / 100;
                }
                console.log('Sortie : ' + number);
            }
            return Number(number).toFixed(2);
        }

        /**
         * Sous-total net de chaque groupe de produits réunis par TVA
         *
         * @param {table} group
         */
        function getSubTotalHT(group) {
            var result = 0,
                valid = group.length > 0 ? true : false;
            if (valid) {
                group.forEach(function (item, index) {
                    result += parseFloat(item.montantHT);
                });
            }
            return Number(result).toFixed(2);
        }

        /**
         * Sous-total de taxes suivant le montant de la TVA
         *
         * @param {table} group
         */
        function getTvaTotal(group) {
            var result = 0;
            var valid = group.length > 0 ? true : false;
            if (valid) {
                group.forEach(function (x, i) {
                    let n = roundNumber(x.montantHT) * (x.TVA / 100);
                    result += n;
                });
            }
            return Number(result).toFixed(2);
        }

        /**
         * Constructeur de l'objet field correspondant à une ligne de texte pour jsPDF
         *
         * @function field
         * @param {any} val
         * @param {string} fStyle
         * @param {number} fSize
         */
        function field(val, fStyle, fSize) {
            this.value = val;
            this.fStyle = fStyle;
            this.fSize = fSize;
        }

        /**
         * Fonction perméttant de générer une ligne de texte avec jsPDF
         *
         * @function addText
         * @param {Object} jsDoc
         * @param {number} fSize
         * @param {string} fStyle
         * @param {string} text
         * @param {number} posX
         * @param {number} posY
         * @param {boolean} split
         */
        function addText(jsDoc, fSize, fStyle, text, posX, posY, split, length) {
            jsDoc.setFontSize(fSize);
            jsDoc.setFontStyle(fStyle);

            if (split)
                text = jsDoc.splitTextToSize(text, length ? length : 100);

            jsDoc.text(text, posX, posY);
        }

        function approximate(x, n) {
            var result = 0;
            if (n + 1 >= 1) {
                for (var i = 0; i < n + 1; i++) {
                    result += Math.pow((-1) * x, i);
                    console.log('i = ' + i + ', result = ' + result);
                }
            }
            return result;
        }

        function approximate2(n) {
            var result = 0;
            if (n >= 2) {
                for (var i = 0; i < n + 1; i++) {
                    result += Math.pow((-1) * 0.1, i);
                    console.log('i = ' + i + ', result = ' + result);
                }
            }
            else {
                result = 0.9;
            }
            return result;
        }

        /**
         * Fonction perméttant de générer et intégrer l'interprétation des tableaux HTML
         * au format à l'intérieur du document en cours de construction avec jsPDF
         *
         * @function getAutoTables
         * @param {Object} doc
         * @param {Table} tableList
         * @param {number} offset
         * @param {number} startX
         * @param {number} startY
         */
        function getAutoTables(doc, tableList, offset, startX, startY) {
            var counter = 0;
            if (Array.isArray(tableList)) {
                var len = tableList.length;
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        var table = tableList[i];
                        var res = doc.autoTableHtmlToJson(table),
                            options = {
                                headerStyles: {
                                    fillColor: [31, 31, 31]
                                },
                                drawCell: function (cell, data) {
                                    var rows = data.table.rows;
                                    if ((data.row.index == rows.length - 2) && (i != len - 1)) {
                                        let lastFootColumn = table.tFoot.children[0].childNodes[4].innerHTML,
                                            startStyleIndex = 0;

                                        // Indice de départ pour colorier le footer selon la tva
                                        if (lastFootColumn == 'Montant TTC')
                                            startStyleIndex = 1;
                                        else
                                            startStyleIndex = 4;

                                        if (data.column.index >= startStyleIndex) {
                                            doc.setFillColor(31, 31, 31);
                                            doc.setTextColor(255, 255, 255);
                                        }
                                    }
                                },
                                theme: 'grid',
                                margin: {
                                    left: startX
                                },
                                startY: i == 0 ? startY : doc.autoTable.previous.finalY + offset,
                                styles: {
                                    fontSize: 6,
                                    fontStyle: 'bold',
                                    overflow: 'linebreak'
                                },
                                columnStyles: {
                                    0: { columnWidth: 120 },
                                    1: { columnWidth: 35 },
                                    2: { columnWidth: 35 }
                                },
                                showHeader: 'firstPage'
                            };

                        var pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
                        var previousPageCount = i == 0 ? 1 : doc.autoTable.previous.pageCount;
                        doc.setPage(1 + pageNumber - previousPageCount);
                        doc.autoTable(res.columns, res.data, options);
                        counter += res.columns.length;
                    }
                }
            }
        }

    }])
    .service('datas', [function () {
        this.order = function () {
            return {
                "data": {
                    "annule": false,
                    "preparation": false,
                    "retour": false,
                    "description":
                        "VENTE ISSUE COMMANDE ESCAL'ISI",
                    "identifiant": "82381647",
                    "lignesCommandes": [
                        {
                            "annule": false,
                            "idLigneCommande": "103219051",
                            "article": {
                                "type": "produit",
                                "identifiant": 58982914,
                                "estProxicompte": true,
                                "codeCabestan": "68047",
                                "tauxTVA": 20, "codeTVA": "10",
                                "libelle": "COLISSIMO EMB. FRANCE SANS SIGN. STAR WARS M  2015 UNITE",
                                "remises": []
                            },
                            "description": "COLISSIMO EMB. FRANCE SANS SIGN. STAR WARS M  2015 UNITE",
                            "montantHT": "5.18",
                            "quantite": "1",
                            "codePrixChangeable": null,
                            "remises": [],
                            "remisesAAppliquerIds": []
                        },
                    ],
                    "montantTotal": "28.32",
                    "montantTotalEncaissable":
                        "28.32",
                    "vendeur": {
                        "etablissement": null,
                        "identifiant": 60083345,
                        "libelle": "ISI_Store_1",
                        "idRh": null,
                        "profil": null,
                        "site": null
                    },
                    "idCreateur": 60083345,
                    "numero": "33043712",
                    "paiements": [],
                    "client": {
                        "identifiant": 58981820,
                        "cartePro": "PP00200037661",
                        "coclico": "1010519",
                        "siret": "49009659100113",
                        "adresse": {
                            "adresse1": "IMERYS CERAMICS FRANCE AVEC UN BONUS QUI REND NOTRE ADRESSE SUPER LONGUE",
                            "adresse2": null,
                            "adresse3": "LA GARE",
                            "adresse4": null,
                            "codePostal": "34090",
                            "ville": "MONTPELLIER, 29 IMPASSE DES PERSONNES QUI AIMENT CODER EN JAVA ALORS QUE C# C'EST MIEUX"
                        },
                        "civiliteId": null,
                        "nom": "IMERYS CERAMICS FRANCE",
                        "nomSuite": "",
                        "estProxicompte": false,
                        "xxaBlIdent": true,
                        "contact": null,
                        "actif": true
                    },
                    "site": {
                        "identifiant": 1018550,
                        "libelle": "PARIS 17 PPDC"
                    },
                    "dateVente": "18/08/2017",
                    "typeVente": "VENTE_LOCALE",
                    "estUnRetour": false,
                    "estModifiablePaiement": false
                }
            };
        };

        this.vacationInfos = function () {
            return {
                site: {
                    adresse1: null,
                    adresse2: "27",
                    adresse3: null,
                    adresse4: "RUE DES RENAUDES",
                    cp: "75017",
                    moneo: false,
                    regate: "752290",
                    ville: "PARIS",
                    codeIsoGeographique: "FR-75",
                    cb: true
                },
                vacation: {
                    identifiant: 60763344,
                    date: "07/09/2017",
                    pointTransaction: {
                        libLong: "ISI_Store_752290_PARIS 17 PPDC",
                        typeCaisse: "IS",
                        id: 58983344,
                        acloturer: false
                    }
                }
            }
        };

        this.ppdc = function () {
            return 'PARIS 17 PPDC';
        };
    }])

    .service('tpe', ['$http', function ($http) {
        this.pay = function () {
            let url = 'https://isistore.local.intra.laposte.fr:1337/verifone/sendPayment';
            return $http({
                method: "get",
                url: url,
                params: { amount: 100 }
            });
        };
    }]);