(function(app) {

	app.directive('btnBack', btnBack);

	btnBack.$inject = ['$window', '$location', '$transitions'];
	function btnBack($window, $location, $transitions) {
		return {
			restrict: 'E',
			scope: {},
			template: '<div class="back" ng-show="btnShow"></div>',
			link: function (scope, element, attrs) {
				element.bind('click', function () {
          			$window.history.back();
          			scope.$apply();
				});
				if ($location.path() != '/') scope.btnShow = true;
				$transitions.onStart( { to: 'info' }, function(trans) {
					scope.btnShow = false;
				});
				$transitions.onStart( { from: 'info' }, function(trans) {
					scope.btnShow = true;
				});
			}
		}
	}
})(angular.module('pogoda'));