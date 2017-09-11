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
