angular.module('resumeApp')
  .controller('SuggestCtrl', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      window.location.href = 'index.html';
      return;
    }

    $scope.resumeFile = {};
    $scope.jobDescription = '';
    $scope.loading = false;
    $scope.responseText = '';

    function loadInitialData() {
      $scope.loading = true;

      $http({
        method: 'GET',
        url: 'https://resume-suggester.onrender.com/api/resume',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }).then(
        function (res) {
          $scope.loading = false;
          $scope.resumeFile.name = res.data.message;
        },
        function (err) {
          $scope.loading = false;
          if (err.status === 401 || err.status === 403) {
            localStorage.removeItem('jwtToken');
            alert('Session expired. Please log in again.');
            window.location.href = 'index.html';
          } else if(err.status === 404){
            $scope.loading = false;
            $scope.resumeFile.name = "No resume uploaded";
          } else {
            console.error('Failed to load initial data:', err);
          }
        }
      );
    }

    loadInitialData();

    $scope.submitForm = function () {
      $scope.loading = true;

      // If no new file selected, use /api/suggestV2
      if (!$scope.resumeFile.lastModified) {
        $http({
          method: 'POST',
          url: `https://resume-suggester.onrender.com/api/suggestV2`,
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          data: {
            jobDescription: $scope.jobDescription,
            resumeFileName: $scope.resumeFile.name
          }
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
      } else {
        // File selected: Use original suggest endpoint
        const formData = new FormData();
        formData.append('file', $scope.resumeFile);
        formData.append('data', $scope.jobDescription);

        $http({
          method: 'POST',
          url: 'https://resume-suggester.onrender.com/api/suggest',
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
      }
    };
  }]);