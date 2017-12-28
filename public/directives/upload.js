angular.module('uploadDirectiveApp', [])
    .directive('mbUpload', ['$parse', '$http', function ($parse, $http) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                let model = $parse(attrs.isiUpload);
                element.bind('change', function () {
                    let file = element[0].files[0];
                    let fd = new FormData();
                    fd.append('file', file);
                    fd.append('date', new Date().toLocaleDateString());
                    fd.append('id', 1339);
                    console.log(fd.entries().next());
                    jQuery.ajax({
                        url: '/api/upload',
                        data: fd,
                        cache: false,
                        contentType: false,
                        processData: false,
                        method: 'POST',
                        type: 'POST', // For jQuery < 1.9
                        success: function(data){
                            console.log(data);
                        },
                        xhr:function(){
                            let xhr = new XMLHttpRequest();
                            xhr.upload.addEventListener('progress', function(evt){
                                if(evt.lengthComputable){
                                    let percentComplete = evt.loaded / evt.total;
                                    percentComplete = parseInt(percentComplete * 100);
                                    $('.progress-bar').text(percentComplete + '%');
                                    $('.progress-bar').width(percentComplete + '%');
                                    console.log('Progression : ' + percentComplete + ' %');
                                }

                            });
                            return xhr;
                        }
                    });
                });
            }
        }
    }]);