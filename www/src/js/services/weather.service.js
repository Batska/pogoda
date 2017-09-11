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