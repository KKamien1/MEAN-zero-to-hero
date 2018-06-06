angular.module('meanhotel').directive('mhNavigation', nhNavigation);

function nhNavigation() {
  return {
    element: 'E',
    templateUrl: 'angular-app/navigation-directive/navigation-directive.html'
  }
}