(function() {
  'use strict';

  angular
    .module('track.services')
    .factory('userData', userData);

  userData.$inject = ['$http', '$location'];

  function userData ($http, $location) {
    return {
      getData: getData,
      getLiftData: getLiftData,
      submitLift: submitLift,
      deleteLift: deleteLift,
      removeLiftData: removeLiftData
    };

    function getData (callback) {
      return $http({
        method: 'GET',
        url: '/api/user',
      })
      .then(res => makeUnique(res.data));
    }

    function getLiftData (liftName) {
      return $http({
        method: 'GET',
        url: '/api/' + liftName,
      })
      .then(res => res.data);
    }

    function submitLift (storage) {
      storage.lift = capitalizeFirst(storage.lift);
      return $http({
        method: 'POST',
        url: '/api/submitLift',
        data: storage
      })
      .then(data => $location.path('/' +  storage.lift));
    }

    function deleteLift (lift, type='delete') {
      let choice = false;
      type === 'delete' ? choice = confirm('Are you sure?') : choice = true;
      if (choice) {
        $http({
          method: 'DELETE',
          url: '/api/delete/' + lift
        })
        .then(() => $location.path('/'));
      }
    }

    function removeLiftData (id) {
      var choice = confirm('Are you sure?');
      if (choice) {
        return $http({
          method: 'DELETE',
          url: '/api/remove/' + id
        })
        .then (res => res);
      }
    }

    /* Helper Functions */
    
    function makeUnique (array) {
      return array.reduce((acc, ele) => {
        if (acc.indexOf(ele.lift) === -1) {
          acc.push(ele.lift);
        }
        return acc;
      }, []);
    }

    function capitalizeFirst (string) {
      var lowerCase = string.toLowerCase();
      var upperFirst = lowerCase[0].toUpperCase();
      return upperFirst +lowerCase.substr(1);
    }
  }
})();