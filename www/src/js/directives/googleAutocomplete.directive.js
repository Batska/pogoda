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