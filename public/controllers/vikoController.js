(function () {

    angular.module('vikoApp', [])
        .controller('vikoController', [
            '$scope',
            '$location',
            'localStorageManager',
            function (
                $scope,
                $location,
                lsm
            ) {

                // MODELS

                // LISTENERS
                document.getElementById('dice').addEventListener("click", function () {
                    $scope.showRule = false;
                    var i = 0;
                    var interval = setInterval(function () {
                        $scope.$apply(function () {
                            if (i != 10) {
                                i++;
                                $scope.canvas.style.transform = "rotateZ(" + Math.pow(-1, i) * 5 * i + "deg) translateX(10px)";
                                $scope.canvas2.style.transform = "rotateZ(" + Math.pow(-1, i) * -5 * i + "deg) translateX(-10px)";
                            } else {
                                getRandomDice($scope.ctx, true, false);
                                getRandomDice($scope.ctx2, false, true);
                                clearInterval(interval);
                            }
                        });
                    }, 200);

                });

                document.getElementById('dice2').addEventListener("click", function () {
                    $scope.showRule = false;
                    var i = 0;
                    var interval = setInterval(function () {
                        $scope.$apply(function () {
                            if (i != 10) {
                                i++;
                                $scope.canvas.style.transform = "rotateZ(" + Math.pow(-1, i) * 5 * i + "deg) translate(10px, 10px)";
                                $scope.canvas2.style.transform = "rotateZ(" + Math.pow(-1, i) * -5 * i + "deg) translate(-10px, 10px)";
                            } else {
                                getRandomDice($scope.ctx, true, false);
                                getRandomDice($scope.ctx2, false, true);
                                clearInterval(interval);
                            }
                        });
                    }, 150);

                });

                // PRIVATE
                function setCanvasParams(canvas) {
                    canvas.style.background = "#34495e";
                    canvas.style.borderRadius = "10px";
                    canvas.style.transition = "0.250s";
                }

                function drawCircle(_ctx, posX, posY) {
                    _ctx.beginPath();
                    _ctx.arc(posX, posY, 10, 0, 2 * Math.PI, false);
                    _ctx.fill();
                    _ctx.closePath();
                }

                function getRandomDice(_ctx, isOne, isTwo) {
                    _ctx.clearRect(0, 0, $scope.width, $scope.height);
                    var nb = Math.floor(Math.random() * 6) + 1;

                    if(isOne)
                        $scope.diceOne = nb;
                    else
                        $scope.diceTwo = nb;

                    console.log(nb);
                    getDice(_ctx, nb);
                }

                function getDice(_ctx, index) {
                    let dice = $scope.dices[index];
                    if (dice) {
                        dice.forEach(function (val, index) {
                            drawCircle(_ctx, val.px, val.py);
                        });
                        $scope.showRule = true;
                    }
                }

                // INIT
                (function (s) {
                    // ACTIONS
                    s.canvas = document.getElementById('dice');
                    s.canvas2 = document.getElementById('dice2');

                    $scope.width = s.canvas.width,
                    $scope.height = s.canvas.height;

                    s.ctx = s.canvas.getContext('2d');
                    s.ctx.fillStyle = "#FFFFFF";

                    s.ctx2 = s.canvas2.getContext('2d');
                    s.ctx2.fillStyle = "#FFFFFF";

                    setCanvasParams(s.canvas);
                    setCanvasParams(s.canvas2);

                    s.dices = {
                        1: [{
                            px: s.width / 2,
                            py: s.height / 2
                        }],
                        2: [{
                            px: s.width / 4,
                            py: 3 * s.height / 4
                        }, {
                            px: 3 * s.width / 4,
                            py: s.height / 4
                        }],
                        3: [{
                            px: s.width / 4,
                            py: 3 * s.height / 4
                        }, {
                            px: 3 * s.width / 4,
                            py: s.height / 4
                        }, {
                            px: s.width / 2,
                            py: s.height / 2
                        }],
                        4: [{
                            px: s.width / 4,
                            py: 3 * s.height / 4
                        }, {
                            px: s.width / 4,
                            py: s.height / 4
                        }, {
                            px: 3 * s.width / 4,
                            py: 3 * s.height / 4
                        }, {
                            px: 3 * s.width / 4,
                            py: s.height / 4
                        }],
                        5: [{
                            px: s.width / 4,
                            py: 3 * s.height / 4
                        }, {
                            px: s.width / 4,
                            py: s.height / 4
                        }, {
                            px: 3 * s.width / 4,
                            py: 3 * s.height / 4
                        }, {
                            px: 3 * s.width / 4,
                            py: s.height / 4
                        }, {
                            px: s.width / 2,
                            py: s.height / 2
                        }],
                        6: [{
                            px: s.width / 4,
                            py: 3 * s.height / 4
                        }, {
                            px: s.width / 4,
                            py: s.height / 4
                        }, {
                            px: 3 * s.width / 4,
                            py: 3 * s.height / 4
                        }, {
                            px: 3 * s.width / 4,
                            py: s.height / 4
                        }, {
                            px: s.width / 4,
                            py: s.height / 2
                        }, {
                            px: 3 * s.width / 4,
                            py: s.height / 2
                        }]
                    };

                    s.diceOne = 5;
                    s.diceTwo = 2;
                    getDice(s.ctx, s.diceOne);
                    getDice(s.ctx2, s.diceTwo);

                })($scope);

            }]);
})();