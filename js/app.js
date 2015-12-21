var app = angular.module('taxReceipt', ['mgcrea.ngStrap']);
var max = 0.5219;

app.controller('TaxReceiptCtrl', function($scope, $http) {
	// Load budget from JSON file
	$http.get('data/budget.json').success(function(data) { $scope.budget = angular.fromJson(data); });
	$scope.tax = null;
	$scope.calculateReceipt = function() {
		$scope.tax = angular.copy($scope.calculate);
	};
});

app.directive('receipt.category', function() {
	return {
		templateUrl: 'templates/category.html',
		link: function(scope, elem, attrs) {
			scope.tooltip = {};
			scope.toggleCategory = function(category) {
				var toggled = !scope.category.show;
				angular.forEach(scope.budget.categories, function(cat) {
					if(cat.show) cat.show = false;
				});
				scope.category.show = toggled;
			};
		}
	}
})

app.directive('receipt.dataBar', function() {
	return {
		link: function(scope, elem, attrs) {
			var decimal = scope.sub? scope.sub.percent : scope.category.percent;
			var percent = Math.round((decimal / max)*100) + '%';
			elem.attr('class', 'data-bar');
			elem.css('width', percent);
		}
	}
})
