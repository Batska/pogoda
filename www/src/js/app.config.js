(function (app) {

    app.config(['$stateProvider', '$urlServiceProvider', function ($stateProvider, $urlServiceProvider) {
		$urlServiceProvider.rules.otherwise({
			state: 'info'
		});

		$stateProvider.state('info', {
			url: '/',
			component: 'weatherInfo'
		});

		$stateProvider.state('detail', {
			url: '/detail',
			component: 'weatherDetail'
		});
  	
    }]);

})(angular.module('pogoda'));