angular.module('main')
    .controller('mathController', ['$scope', function ($scope) {

        /**
         * Initialisation
         */

        ((scope) => {
            scope.totalPoints = 50;
            scope.xL = 0;
            scope.xR = 1000;
            scope.step = Math.abs($scope.xL - $scope.xR) / ($scope.totalPoints - 1);
            scope.mesh = mesh1D(scope.xL, scope.xR, scope.totalPoints, scope.step);
            scope.finalTime = 20;
            scope.currentPoints = [];

            scope.mesh.forEach((point) => {
                scope.currentPoints.push(new Point(point, 100 * Math.exp(-(point * point) / 10000)));
            });

            console.log('MESH POINTS --->', scope.currentPoints);
            console.log('CURRENT POINTS --->', scope.currentPoints);

            scope.canvas = document.getElementById('math');
            scope.ctx = scope.canvas.getContext('2d');
            scope.canvas.style.background = "#34495e";
            scope.canvas.style.borderRadius = "10px";
            scope.canvas.style.transition = "0.250s";
            scope.canvas.height = "300";
            scope.canvas.width = "450";

            draw(scope.mesh);
            draw(scope.currentPoints);

            let time = new Date().getTime(),
                dt = (new Date().getTime() - time) / 1000,
                timeStep = 0;
            let interval = setInterval(() => {
                let CFL = dt < 0.5 * $scope.step;
                if (CFL) {
                    $scope.$apply(() => {
                        transportSolver(timeStep);
                    });
                    timeStep += dt;
                    console.log("TIMESTEP ->", timeStep);
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
                    x = typeof (point) == 'object' ? point.x + 25 : point + 25,
                    nextX = typeof (pointsArray[index]) == 'object' ? pointsArray[index].x + 25 : pointsArray[index] + 25,
                    nextY = typeof (pointsArray[index]) == 'object' ? $scope.canvas.height - 2 - pointsArray[index].y : $scope.canvas.height - 2;
                let newPoint = new Point(x, y);
                $scope.ctx.fillStyle = typeof (point) == 'object' ? "#FFF125" : "#FFFFFF";

                $scope.ctx.beginPath();
                $scope.ctx.moveTo(x,y);
                $scope.ctx.lineTo(nextX, nextY);
                $scope.ctx.stroke();

                $scope.ctx.beginPath();
                $scope.ctx.arc(newPoint.x, newPoint.y, 2, 0, 2 * Math.PI, false);
                $scope.ctx.fill();
                $scope.ctx.closePath();
            });
        }

        function transportSolver(dt) {
            let result = [];
            $scope.ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
            for (let j = 0; j < $scope.mesh.length - 1; j++) {
                $scope.currentPoints[j].x = $scope.mesh[j];

                let y = $scope.currentPoints[j].y;
                $scope.currentPoints[j].y = y - (dt / $scope.step) * ($scope.currentPoints[j + 1].y - y);
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

    }]);