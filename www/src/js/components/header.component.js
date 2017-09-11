(function (app) {

	app.component('header', {
		templateUrl: './src/templates/header.template.html',
		controller: headerController,
		controllerAs: 'vm'
	});

	headerController.$inject = [];
	function headerController() {
		var vm = this;

		vm.title = 'Pogoda';
	}

})(angular.module('pogoda'));