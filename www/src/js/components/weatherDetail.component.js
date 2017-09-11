(function (app) {

	app.component('weatherDetail', {
		templateUrl: './src/templates/weatherDetail.template.html',
		controller: weatherDetailController,
		controllerAs: 'vm',
		bindings: {
			weather: '<'
		}
	});

	weatherDetailController.$inject = ['weatherService', 'dateService', '$timeout', '$scope'];
	function weatherDetailController(weatherService, dateService, $timeout, $scope) {
		var vm = this;

		vm.updateIntrval = 60000;

		$timeout(function() {
			vm.weather = weatherService.getCachedWeather(true);
		}, 0);
		vm.getDate = dateService.getDate;
		vm.getTime = dateService.getTime;

		(function refreshEvery(){
			weatherService.getWeather({
				detailed: true
			}).then(function(data) {
				vm.weather = data;
				console.log('2', vm.weather);
			});
			refreshingPromise = $timeout(refreshEvery, vm.updateIntrval);
		}());
    	$scope.$on('$destroy', function() {
        	if (refreshingPromise) {
            	$timeout.cancel(refreshingPromise);
            }   
    	});
		
	}

})(angular.module('pogoda'));