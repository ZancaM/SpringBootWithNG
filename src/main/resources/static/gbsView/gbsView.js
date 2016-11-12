//Created by Matteo Zancanella on October 2016 MIT License - FHIR Starter Team

'use strict';

angular.module('myApp.gbsView', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/gbsView', {
            templateUrl: 'gbsView/gbsView.html',
            controller: 'GbsViewCtrl'
        });
    }])

    .controller('GbsViewCtrl', ['$scope', '$http', '$q', function($scope, $http, $q) {
        //todo: make available : radio,input,dropdown,datepicker
        $scope.showReviewScreen = false;

        var configURL = "config.json";

        $scope.next = function() {
            if($scope.currentView.action &&
                $scope.currentView.action[$scope.currentView.selectedValue] ){
                    $scope.currentView.processed = true;
                    processAction($scope.currentView.action[$scope.currentView.selectedValue]);
            }
        }

        $scope.answerSelected = function(key, value) {
            $scope.currentView.selectedValue = key;
            $scope.currentView.actualValue = value;
            $scope.next();
        }

        function processAction(action) {
            if (action) {
                if (action.type) {
                    switch (action.type) {
                        case "jumpTo":
                            jumpTo(action);
                            break;
                        case "request":
                            requestRecommendation();
                            break;
                        case "complexAction":
                            processComplexAction();
                            break;
                        case "showReview":
                            showReview();
                            break;
                    }

                } else {
                    throw "Error: specify a type for action";
                }
            }
        }

        function showReview() {
            $scope.showReviewScreen = true;
        }

        function jumpTo(action) {
            if(action.value && $scope.config.workflow[action.value]) {
                $scope.currentView = $scope.config.workflow[action.value];
                if($scope.currentView.defaultOption){
                    $scope.currentView.selectedValue = $scope.currentView.defaultOption;
                }
                $scope.currentKey = action.value;
            }
        }

        function  requestRecommendation() {
            postToServer();
        }

        function processComplexAction() {
            if ($scope.config.complexActions && $scope.config.complexActions[$scope.currentKey]) {
                var complexActions = $scope.config.complexActions[$scope.currentKey];

                for (var key in complexActions) {
                    var complexAction = complexActions[key];
                    var match = true;
                    if (complexAction.workflow) {
                        angular.forEach(complexAction.workflow, function (value, id) {
                            if ($scope.config.workflow[id].selectedValue != value) {
                                match = false;
                            }
                        });
                    }
                    if (match == true) {
                        //found a match process the action
                        var action = complexAction.action[$scope.currentView.selectedValue];
                        processAction(action);
                        return;
                    }
                }
            }
        }

        function loadConfiguration() {

            var defer = $q.defer();
            $http.get(configURL).then(function successCallback(data){
                defer.resolve(data);
            }, function errorCallback(error){
                console.log(error);
                defer.reject(error);
            });

            return defer.promise;
        }

        function init() {
            $scope.formObj = {}

            loadConfiguration().then(
                function(doc) {
                    if(doc && doc.data) {
                        $scope.config = doc.data;
                        // SetFirstQuestion
                        $scope.currentView = $scope.config.workflow["Q1"];
                    } else {
                        throw "Error: config at address " + configURL + "is not available";
                    }
                }
            )
        }


        // $scope.generateJson = function() {
        //     $scope.formObj.jsonObj = JSON.stringify({
        //             "resourceType": "Patient",
        //             "id": "523050",
        //             "text": {
        //                 "status": "generated"
        //             },
        //             "active": true,
        //             "name": [
        //                 {
        //                     "family": [
        //                         "Dixon"
        //                     ],
        //                     "given": [
        //                         "Marla",
        //                         "M"
        //                     ]
        //                 }
        //             ],
        //             "gender": "female",
        //             "birthDate": "1968-02-14",
        //             "address": [
        //                 {
        //                     "use": "home",
        //                     "line": [
        //                         "1221 Middle Street"
        //                     ],
        //                     "city": "Atlanta",
        //                     "state": "GA",
        //                     "postalCode": "30308"
        //                 }
        //             ]
        //         }
        //     );
        // }

        $scope.postToServer = function() {
            $http.post($scope.config.serverToPost, $scope.config.workflow).
            success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(data);
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log(data);

            });
        }

        //Start the app
        init();


    }]);