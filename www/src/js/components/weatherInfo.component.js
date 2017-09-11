(function (app) {

	app.component('weatherInfo', {
		templateUrl: './src/templates/weatherInfo.template.html',
		controller: weatherInfoController,
		controllerAs: 'vm',
		bindings: {
			weatherInfo: '<'
		}
	});

	weatherInfoController.$inject = ['weatherService', 'dateService', '$timeout', '$scope'];
	function weatherInfoController(weatherService, dateService, $timeout, $scope) {
		var vm = this;

		vm.updateIntrval = 60000;

		$timeout(function() {
			vm.weatherInfo = weatherService.getCachedWeather();
		}, 0);
		vm.getDate = dateService.getDate;
		vm.getTime = dateService.getTime;

		weatherService.getWeather().then(function(data) {
			vm.weatherInfo = data;
		});

		var refreshingPromise;
		(function refreshEvery(){
			weatherService.getWeather().then(function(data) {
				vm.weatherInfo = data;
				console.log('1', vm.weatherInfo);
				if (window.cordova) {
					cordova.plugins.notification.local.update({
					    id: 1,
					    text: isRain(vm.weatherInfo) ? 'Сейчас дождь, возьми зонт!' : 'Сейчас не дождь, не бери зонт!',
					    at: new Date(new Date().getTime() + 10 * 1000)
					});
				}
			});
			refreshingPromise = $timeout(refreshEvery, vm.updateIntrval);
    	}());
    	$scope.$on('$destroy', function() {
        	if (refreshingPromise) {
            	$timeout.cancel(refreshingPromise);
            }   
    	});

    	function isRain(weatherObject) {
    		return (weatherObject.data.desctiption.indexOf('rain') >= 0);
    	}

	}

})(angular.module('pogoda'));