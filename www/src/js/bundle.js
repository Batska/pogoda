(function () {
    angular.module('pogoda', ['ui.router']);
})();
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
(function (app) {

    app.run([function () {
    	
    }]);

})(angular.module('pogoda'));
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
(function(app) {
	
	app.directive('googleAutocomplete', googleAutocomplete);

	googleAutocomplete.$inject = [];
	function googleAutocomplete() {
		return {
			restrict: 'A',
			scope: {},
			link: function (scope, element, attrs) {
				element.bind('click', function () {
          			alert('Не успел, но сделать это можно так:\n\r1. Воспользоваться Google Places API\n\r2. Лучше взять уже готовый https://github.com/vskosp/vsGoogleAutocomplete\n\r3. Юзер выбрал город - получаем его Place id\n\r4. Делаем еще запрос с Place id на https://maps.googleapis.com/maps/api/place/details/output?parameters и получаем координаты\n\r5. Вызываем функцию getWeather сервиса weatherService с координатами в аргументе и записываем полученную погоду');
				});
			}
		}
	}
})(angular.module('pogoda'));
(function (app) {

	app.service('dateService', dateService);

	function dateService() {

		var self = this;

		//
		self.getTime = getTime;
		self.getDate = getDate;
		//

		function getTime(dateString, dividerSymbol) {
			if (dateString == undefined) return;

			var date = new Date(dateString);
			var hours = date.getHours().toString();
			var minutes = date.getMinutes().toString();
			if (hours.length == 1) {
				hours = '0' + hours;
			}
			if (minutes.length == 1) {
				minutes = '0' + minutes;
			}
			var divider = ' : ';
			if (dividerSymbol != undefined) {
				divider = dividerSymbol;
			}
			return hours + divider + minutes;
		}

		function getDate(dateString, dividerSymbol) {
			if (dateString == undefined) return;
			
			var date = new Date(dateString);
			var day = date.getDate().toString();
			var month = (date.getMonth() + 1).toString();
			var year = date.getFullYear().toString();
			if (day.length == 1) {
				day = '0' + day;
			}
			if (month.length == 1) {
				month = '0' + month;
			}
			var divider = '.';
			if (dividerSymbol != undefined) {
				divider = dividerSymbol;
			}
			return day + divider + month + divider + year;
		}
	}

})(angular.module('pogoda'));

(function (app) {

	app.service('geolocationService', geolocationService);

	geolocationService.$inject = ['$q'];
	function geolocationService($q) {

		var self = this;
		//
		self.getPosition = getPosition;
		//

		function getPosition() {
			return $q(function (resolve, reject) {
				navigator.geolocation.getCurrentPosition(resolve, reject);
			});
		}
	}

})(angular.module('pogoda'));

(function (app) {

	app.service('weatherService', weatherService);
	
	weatherService.$inject = ['$http', '$q', 'geolocationService', 'dateService'];
	function weatherService($http, $q, geolocationService, dateService) {
		var self = this;

		//
		self.appId = 'b8b640df5f49fb49d948d62724609870'; 
		self.getWeather = getWeather;
		self.getCachedWeather = getCachedWeather;
		//

		function getWeather(params) {
			var deffered = $q.defer();

			var config = {
				detailed: false, // true - получить детальную информацию о погоде
				location: null // null - текущее местоположение; array - координаты lat, long - [20.33, 30.33]
			};

			if (params != undefined) {
				for (var opt in config) {
					if (params.hasOwnProperty(opt)) {
						config[opt] = params[opt];
					}
				}
			}

			if (config.location === null) {
				geolocationService.getPosition().then(function (position) {
					config.location = [position.coords.latitude, position.coords.longitude];
					getDataFromAPI(getAPILink(config));
				}).catch(function (error) {
					deffered.reject(error);
				});	
			}
			else getDataFromAPI(getAPILink(config));

			return deffered.promise;


			function getAPILink(params) {
				var link = 'http://api.openweathermap.org/data/2.5/';
				if (!params.detailed) {
					link += 'weather';
				}
				else link += 'forecast';
				link += '?units=metric&';
				link += 'lat=' + params.location[0] + '&lon=' + params.location[1];
				link += '&appid=' + self.appId;

				return link;
			}

			function getDataFromAPI(url) {
				$http.get(getAPILink(config)).then(function (response) {
					//console.log(response);
					var needfulData = {
						timestamp: new Date(),
						data: formatData(response, config.detailed)
					};
					cacheWeather(needfulData, config.detailed);
					deffered.resolve(needfulData);
				}).catch(function (error) {
					deffered.reject(error);
				});

				function formatData(data, isDetailed) {
					if (!isDetailed) {
						return {
							temperature: parseInt(data.data.main.temp),
							humidity: parseInt(data.data.main.humidity),
							pressure: parseInt(data.data.main.pressure),
							windSpeed: parseInt(data.data.wind.speed),
							city: data.data.name,
							description: data.data.weather[0].main,
							icon: data.data.weather[0].icon
						}
					}
					else {
						console.log('daat', data);
						var object = {
							city: data.data.city.name,
							list: []
						};
						var today = new Date();
						for (var i = 0; i < 8; i++) {
							var time = new Date(data.data.list[i].dt_txt);
							object.list.push({
								time: dateService.getTime(time, ':'),
								temperature: parseInt(data.data.list[i].main.temp),
								//description: data.data.list[i].weather[0].main,
								icon: data.data.list[i].weather[0].icon
							});
						}
						return object;
					}
				}
			}

		}


		function getCachedWeather(isDetailed) {
			var key = 'weather';
			if (isDetailed) {
				key = 'weatherDetailed';
			}

			return angular.fromJson(localStorage.getItem(key));
		}

		function cacheWeather(data, isDetailed) {
			var key = 'weather';
			if (isDetailed) {
				key = 'weatherDetailed';
			}
			localStorage.setItem(key, angular.toJson(data));
		}
	}

})(angular.module('pogoda'));