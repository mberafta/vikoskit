(function (ang) {

    ang.module('chatboxApp', [])
        .controller('chatboxController', ['$scope', function ($scope) {
            function analyze(str, words) {
                console.log("ANALYSE : ", str, words);
                let result = [];
                let parts = str.split(' ');
                console.log('Mots à analyser : ', parts);
                if (parts && parts.length > 0) {
                    parts.forEach(function (part, index) {
                        let partVector = toVector(part);
                        words.forEach(function (word, ind) {
                            let wordVector = toVector(word);
                            if (angle(partVector, wordVector) > 0.85) {
                                result.push(word);
                            }
                        });
                    });
                }

                return result;
            };


            (function (s) {

                s.messages = [];

                s.letterIndexes = [
                    { letter: 'a', index: '1' },
                    { letter: 'b', index: '2' },
                    { letter: 'c', index: '3' },
                    { letter: 'd', index: '4' },
                    { letter: 'e', index: '5' },
                    { letter: 'f', index: '6' },
                    { letter: 'g', index: '7' },
                    { letter: 'h', index: '8' },
                    { letter: 'i', index: '9' },
                    { letter: 'j', index: '10' },
                    { letter: 'k', index: '11' },
                    { letter: 'l', index: '12' },
                    { letter: 'm', index: '13' },
                    { letter: 'n', index: '14' },
                    { letter: 'o', index: '15' },
                    { letter: 'p', index: '16' },
                    { letter: 'q', index: '17' },
                    { letter: 'r', index: '18' },
                    { letter: 's', index: '19' },
                    { letter: 't', index: '20' },
                    { letter: 'u', index: '21' },
                    { letter: 'v', index: '22' },
                    { letter: 'w', index: '23' },
                    { letter: 'x', index: '24' },
                    { letter: 'y', index: '25' },
                    { letter: 'z', index: '26' }
                ];
    
                s.themes = [
                    {
                        themeId:"acc",
                        type: 'Accueil',
                        acceptedWords: [
                            'Hello', 'Bonjour', 'Salut', 'Coucou'
                        ],
                        logicalAnwser: function (username) {
                            return 'Bonjour ' + username + ', que voulez-vous savoir?';
                        },
                        proposals: [
                            { content: "Comment ajouter un produit au panier", themeId: "pan1" },
                            { content: "Comment puis-je affranchir une lettre", themeId: "affr1" }
                        ]
                        
                    },
                    {
                        themeId: "affr1",
                        type: 'Affranchissement',
                        acceptedWords: [
                            'lettre', 'suivie', 'prioritaire', 'affranchissement'
                        ],
                        logicalAnswer: function (userMessage) {
                            let keywords = analyze(userMessage.toLowerCase(), this.acceptedWords);
                            let result = "";
                            let finalResult = { msg:"", keywords:keywords };
                            if (keywords.length > 0) {
                                keywords.forEach((kw, i) => {
                                    result += " " + kw;
                                });
                            }
                            finalResult.msg = "Vous souhaitez être aidé pour le sujet suivant : " + result;

                            return finalResult;
                        },
                        themeAnswer: "En quoi puis-je vous aider dans l'affranchissement?",
                        finalAnwsers:[
                            { keyword:"lettre", content:"Appuyez sur le bouton affranchissement afin d'aller à la pesée de votre lettre" },
                            { keyword:"suivie", content:"Votre vignette sera accompagnée d'une vignette de suivi ainsi que d'un ticket de suivi" },
                            { keyword:"prioritaire", content:"La livraison se fait j+1" }
                        ] 
                    }
                ];

                s.currentReply = { value: "" };

                s.chatbox = {
                    currentTheme: s.themes[0]
                };

                s.messages.push({ author: "ISI Bot", content:s.themes[0].logicalAnwser("cher utilisateur") });

                s.changeTheme = function (themeId) {
                    s.chatbox.currentTheme = s.themes.find((t) => { return t.themeId == themeId });
                    s.messages.push({ author: "ISI Bot", content: s.chatbox.currentTheme.themeAnswer });
                };

                s.replyToBot = function () {
                    s.messages.push({ author: "MOI", content: s.currentReply.value });

                    s.messages.push({
                        author:"ISI Bot",
                        content: s.chatbox.currentTheme.logicalAnswer(s.currentReply.value).msg
                    });

                    s.currentAnswers = [];

                    s.chatbox.currentTheme.logicalAnswer(s.currentReply.value).keywords.forEach(function(kw, index){
                        let fa = s.chatbox.currentTheme.finalAnwsers.find((f) => {
                            return f.keyword == kw;
                        });

                        if(fa != null)
                            s.currentAnswers.push(fa);
                    });
                };

            })($scope);


            function angle(vec1, vec2) {
                let vec1Norm = norm2(vec1),
                    vec2Norm = norm2(vec2),
                    scalProd = scalarProduct(vec1, vec2),
                    result = scalProd / (vec1Norm * vec2Norm);

                    console.log("Angle : ", result);

                return Math.abs(result);
            }

            function scalarProduct(vec1, vec2) {
                console.log('produit scalaire : ', vec1, vec2);
                let valid = vec1.length == vec2.length;
                let result = 0;
                if (valid) {
                    let length = vec1.length;
                    for (var j = 0; j < length; j++) {
                        result += vec1[j] * vec2[j];
                    }
                }
                else {
                    console.log("Les vecteurs n'ont pas la même longueur");
                }
                return result;
            }

            function norm2(vec) {
                let length = vec.length;
                let normResult = 0;
                vec.forEach(function (coord, index) {
                    normResult += Math.pow(coord, 2);
                });

                return Math.sqrt(normResult);
            }

            function toVector(str) {
                let result = [];
                for (let j = 0; j < str.length; j++) {
                    let letter = $scope.letterIndexes.find((l) => { return l.letter == str.charAt(j); });
                    if (letter) {
                        result.push(letter.index);
                    }
                }
                return result;
            }

        }]);

})(angular);

