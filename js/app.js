var app = angular.module('taxReceipt', ['mgcrea.ngStrap']);
var maxPercent = 0;

var setTotalBudget = function(budgetData) {
	var total = 0;
	for (var i=0; i<budgetData['categories'].length; i++){
		var category = budgetData['categories'][i];
		if (category['dollars']) {
			total += category['dollars'];
		} else {
			for (var j=0; j<category['categories'].length; j++){
				var subCategory = category['categories'][j];
				total += subCategory['dollars'];
			}
		}
	}
	budgetData['total'] = total;
}

var setCalculatedPercents = function(budgetData) {
	var total = budgetData['total'];
	for (var i=0; i<budgetData['categories'].length; i++){
		var category = budgetData['categories'][i];
		if (category['dollars']) {
			category['percent'] = category['dollars'] / total;
		} else {
			var categoryTotal = 0;
			for (var j=0; j<category['categories'].length; j++){
				var subCategory = category['categories'][j];
				subCategory['percent'] = subCategory['dollars'] / total;
				categoryTotal += subCategory['dollars'];
			}
			category['percent'] = categoryTotal / total;
		}
		maxPercent = Math.max(maxPercent, category['percent']);
	}
}

var budgetCalculation = function(budgetData) {
	setTotalBudget(budgetData);
	setCalculatedPercents(budgetData);
	return budgetData;
};

app.controller('TaxReceiptCtrl', function($scope, $http) {
	// Load budget from JSON file
	$http.get('data/budget.json').success(function(data) {
		 $scope.budget = budgetCalculation(angular.fromJson(data));
	});
	$scope.tax = null;
	$scope.calculateReceipt = function() {
		$scope.tax = angular.copy($scope.property_tax);
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
			var percent = Math.round((decimal / maxPercent)*100) + '%';
			elem.attr('class', 'data-bar');
			elem.css('width', percent);
		}
	}
})
