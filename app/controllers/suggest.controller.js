angular.module('resumeApp')
  .controller('SuggestCtrl', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      window.location.href = 'index.html';
      return;
    }
    $scope.resumeFile = null;
    $scope.jobDescription = '';
    $scope.loading = false;
    $scope.responseText = '';
    $scope.submitForm = function () {
      $scope.loading = true;
      const formData = new FormData();
      formData.append('file', $scope.resumeFile);
      formData.append('data', $scope.jobDescription);
      $http({
        method: 'POST',
        url: 'https://resume-suggester.up.railway.app/api/suggest',
        headers: {
          'Content-Type': undefined,
          'Authorization': 'Bearer ' + token
        },
        data: formData,
        transformRequest: angular.identity
      }).then(
        function (res) {
          $scope.loading = false;
          const msg = res.data?.message || 'No response.';
          $scope.responseText = $sce.trustAsHtml(
            msg.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          );
        },
        function (err) {
          $scope.loading = false;
          if (err.status === 401 || err.status === 403) {
            localStorage.removeItem('jwtToken');
            alert('Session expired. Please log in again.');
            window.location.href = 'index.html';
          } else {
            $scope.responseText = 'Error: ' + (err.data?.message || err.statusText);
          }
        }
      );
    };
  }]);