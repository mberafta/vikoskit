angular.module('main')
    .controller('mathController', ['$scope', function ($scope) {

        /**
         * Initialisation
         */

        ((scope) => {
            $scope.computedResult = [];
            scope.totalPoints = 100;
            scope.xL = 0;
            scope.xR = 1000;
            scope.step = Math.abs($scope.xL - $scope.xR) / ($scope.totalPoints - 1);
            scope.mesh = mesh1D(scope.xL, scope.xR, scope.totalPoints, scope.step);
            scope.finalTime = 20;
            scope.currentPoints = [new Point(0, 0)];
            $scope.advectionSpeed = 3;

            scope.mesh.forEach((point, index) => {
                if (index > 0 && index < $scope.mesh.length - 1)
                    scope.currentPoints.push(new Point(point, exp(point)));
                else
                    scope.currentPoints.push(new Point(point, 100));
            });

            scope.canvas = document.getElementById('math');
            scope.ctx = scope.canvas.getContext('2d');
            scope.canvas.style.background = "#34495e";
            scope.canvas.style.borderRadius = "10px";
            scope.canvas.style.transition = "0.250s";
            scope.canvas.height = "600";
            scope.canvas.width = "600";

            draw(scope.mesh);
            draw(scope.currentPoints);

            var time = new Date().getTime(),
                dt = 0;

            let interval = setInterval(() => {
                let CFL = ($scope.advectionSpeed * dt) / $scope.step < 1;
                if (CFL) {
                    $scope.$apply(() => {
                        transportSolver(dt, $scope.advectionSpeed);
                    });
                    dt = 0.001 * (new Date().getTime() - time);
                }
                else {
                    clearInterval(interval);
                }
            }, 1000 / 60);

        })($scope);

        /**
         * Fonctions privées
         */
        function draw(pointsArray) {
            pointsArray.forEach((point, index) => {
                let y = typeof (point) == 'object' ? $scope.canvas.height - 2 - point.y : $scope.canvas.height - 5,
                    x = typeof (point) == 'object' ? point.x : point;

                let newPoint = new Point(x, y);
                $scope.ctx.fillStyle = typeof (point) == 'object' ? "#FFF125" : "#FFFFFF";

                $scope.ctx.strokeStyle = "green";
                $scope.ctx.lineWidth = "1";

                $scope.ctx.beginPath();
                $scope.ctx.arc(x, y, 2, 0, 2 * Math.PI, false);
                $scope.ctx.fill();
                $scope.ctx.closePath();

                if (index < $scope.mesh.length - 1) {
                    let nextX = typeof (pointsArray[index]) == 'object' ? pointsArray[index + 1].x + 50 : pointsArray[index + 1] + 25,
                        nextY = typeof (pointsArray[index]) == 'object' ? $scope.canvas.height - 2 - pointsArray[index + 1].y : $scope.canvas.height - 2;
                    $scope.ctx.beginPath();
                    $scope.ctx.moveTo(x, y);
                    $scope.ctx.lineTo(nextX, nextY);
                    $scope.ctx.stroke();
                    $scope.ctx.closePath();
                }

            });
        }

        function transportSolver(dt, a) {

            // Réinitialisation de l'écran pour les nouveaux points
            $scope.ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);

            for (let j = 0; j < $scope.mesh.length; j++) {
                $scope.currentPoints[j].x = $scope.mesh[j];

                let y = $scope.currentPoints[j].y;
                if (j == 0)
                    console.log("Image 0 au nouveau temps dt : ", y);

                let coeff = a * Number(dt / $scope.step),
                    diff;

                // Schéma décentré amont ou aval selon la valeur de a
                if (a > 0) {
                    diff = j == 0 ? y : Number(-$scope.currentPoints[j - 1].y + y)
                }
                else {
                    diff = j == $scope.mesh.length - 1 ? y : Number($scope.currentPoints[j + 1].y - y);
                }

                $scope.currentPoints[j].y = Number(y) - coeff * diff;
            }

            draw($scope.currentPoints);
        }

        /**
         * Entités de calcul
         */

        // POINT
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }

        // MAILLAGE
        function mesh1D(xL, xR, totalPoints, step) {
            let result = [xL];
            for (let j = 1; j < totalPoints; j++) {
                result.push(xL + j * step);
            }
            return result;
        }

        function exp(point) {
            return 150 * Math.exp(-Math.pow(point / 100, 4) / 2);
        }

        function sin(point) {
            return 100 * Math.sin((point / 100) * Math.PI / 4);
        }

    }]);