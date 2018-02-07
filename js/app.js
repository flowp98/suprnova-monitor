var app = angular.module('minerMonitor', []);

app.controller('minerMonitorController', ['$scope','$http', '$interval',
    function($scope, $http, $interval){
      $scope.currency = 0;
      $scope.priceDollar = 0;
      $scope.priceBitcoin = 0;
      $scope.priceSatoshi = 0;
      $scope.money = 0;
      $scope.hashrate = 0;
      $scope.balance = 0;
      $scope.currency = "xvg";
      $scope.apiKey = '';

      $scope.totalMined = 0;
      $scope.paidLast24h = 0;
      $scope.unpaid = 0;

      $scope.theme = 'clear-theme';
      $scope.sound = 'off';

      $scope.errorNumber = 0;
      $scope.errorClass = '';

      $scope.currencyToDollar = function(amount) {
        $http.get("api/getPrice.php?currency=" + $scope.currency)
          .then(function (response) {
            $scope.priceDollar = response.data.dollar;
            $scope.money = $scope.currency*$scope.priceDollar;
          });
      };

      $scope.currencyToBitcoin = function(amount) {
        $http.get("api/getPrice.php?currency=" + $scope.currency)
          .then(function (response) {
            $scope.priceBitcoin = response.data.bitcoin;
            var re = new RegExp("0.(0){1,7}");
            $scope.priceSatoshi = $scope.priceBitcoin.replace(re, "");
          });
      };

      $scope.getInfosSuprnova = function(apiKey) {
        if ($scope.apiKey.length > 0) {
          $http.get('api/getInfosSuprnova.php?key='+$scope.apiKey)
            .then(function (response) {
              if (response.data.hashrate > 1 && response.data.balanceConfirmed > 1) {
                $scope.hashrate = response.data.hashrate;
                $scope.balance = response.data.balanceConfirmed;
                $scope.errorNumber = 0;
                $scope.errorClass = '';
              }
              else {
                if ($scope.errorNumber < 15) {
                  $scope.errorClass = 'bg-warning';
                }
                else {
                  $scope.errorClass = 'bg-danger';
                  if (($scope.errorNumber) % 10 == 0 && $scope.sound == 'on') {
                    var audio = new Audio('sounds/appointed.mp3');
                    audio.play();
                  }
                }
                $scope.errorNumber += 1;
              }
            });
          }
      };

      $scope.saveApiKeySuprnova = function(apiKey) {
        if ($scope.apiKey.length > 0) {
          $http.get('api/saveApiKey.php?apiKey=' + apiKey)
            .then(function (response) {
              if (response.data.status == 'success'){
                console.log('SUCCESS');
              }
              else {
                console.log('ERROR');
              }
            });
          }
      };

      $scope.getApiKeySuprnova = function() {
        $http.get('api/getApiKey.php')
          .then(function (response) {
            if (response.data.apiKey != 'NONE') {
              $scope.apiKey = response.data.apiKey;
              $scope.getInfosSuprnova($scope.apiKey);
            }
          });
      };

      $scope.switchTheme = function() {
        if ($scope.theme == 'clear-theme') {
          $scope.theme = 'dark-theme';
        }
        else {
          $scope.theme = 'clear-theme';
        }
      };

      $scope.switchSound = function() {
        if ($scope.sound == 'off') {
          $scope.sound = 'on';
        }
        else {
          $scope.sound = 'off';
        }
      };

      $scope.currencyToDollar(0);
      $scope.currencyToBitcoin(0);
      $scope.getApiKeySuprnova();
      $interval( function(){ $scope.currencyToDollar($scope.currency); $scope.currencyToBitcoin($scope.currency); $scope.getInfosSuprnova($scope.apiKey); }, 20000);
    }
]);
