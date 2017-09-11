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
