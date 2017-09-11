(function (app) {

	app.component('splash', {
		templateUrl: './src/templates/splash.template.html',
		controller: splashController,
		controllerAs: 'vm',
		bindings: {
			hide: '<'
		}
	});

	splashController.$inject = ['$timeout'];
	function splashController($timeout) {
		var vm = this;

		//
		vm.duration = 1200;
		//
		
		$timeout(function () {
			vm.hide = true;
		}, vm.duration);

	}

})(angular.module('pogoda'));