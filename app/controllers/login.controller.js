angular.module('resumeApp')
  .controller('LoginCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.user = {};
    $scope.login = function () {
      $http.post('http://localhost:8080/api/login', $scope.user).then(
        function (res) {
          console.log('Login response:', res.data.message);
          if (res.data && res.data.message) {
            localStorage.setItem('jwtToken', res.data.message);
            window.location.href = 'suggest.html';
          } else {
            alert('Login failed: no token received.');
          }
        },
        function (err) {
          alert('Login error: ' + (err.data?.message || err.statusText));
        }
      );
    };
  }]);