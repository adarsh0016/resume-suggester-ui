angular.module('resumeApp')
  .controller('SignupCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.user = {};
    $scope.signup = function () {
      $http.post('https://resume-suggester.onrender.com/api/register', $scope.user).then(
        function () {
          alert('Signup successful! You can now log in.');
          window.location.href = 'index.html';
        },
        function (err) {
          alert('Signup error: ' + (err.data?.message || err.statusText));
        }
      );
    };
  }]);