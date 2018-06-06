angular.module('meanhotel').controller('HotelController', HotelController)

function HotelController($route, $window, hotelDataFactory, $routeParams, jwtHelper) {
  const vm = this;
  const id = $routeParams.id;
  hotelDataFactory.hotelDisplay(id).then(function (response) {
    vm.hotel = response.data;
    vm.stars = _getArray(response.stars);
  })

  function _getArray(num) {
    return new Array(num)
  }

  vm.isLoggedIn = function () {
    if (AuthFactory.isLoggedIn) {
      return true;
    } else {
      return false
    }
  }

  // Add review function
  vm.addReview = function () {

    const token = jwtHelper.decodeToken($window.sessionStorage.token);
    const username = token.username;

    const postData = {
      name: username,
      rating: vm.rating,
      review: vm.review
    };
    if (vm.reviewForm.$valid) {
      hotelDataFactory.postReview(id, postData).then(function (response) {
        console.log(response.status);
        if (response.status === 200) {
          $route.reload();
        }

      }).catch(function (error) {
        console.log(error);
      });
    } else {
      vm.isSubmitted = true;
    }
  }
};