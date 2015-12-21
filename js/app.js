var app = angular.module('taxReceipt', ['mgcrea.ngStrap']);
var max = .2749;

app.controller('TaxReceiptCtrl', function($scope, $http) {
	// Load budget from JSON file
	$http.get('data/budget.json').success(function(data) { $scope.budget = angular.fromJson(data); });
	$scope.tax = {
		income: null,
		social: null,
		medicare: null,
		source: null,
		total: null
	}

	$scope.calculate = {
		income: null,
		social: null,
		medicare: null,
	}
	$scope.estimate = {
		income: null,
		married: 0,
		children: 0,
	}
	$scope.calculateReceipt = function(isPrecise, thenFn)
	{
		if (isPrecise) {
			$scope.tax = angular.copy($scope.calculate);
			$scope.tax.source = 'precise';
			$scope.tax.total = $scope.tax.income + $scope.tax.social + $scope.tax.medicare;
		} else {
			var incomeTax = .1 * ($scope.estimate.income - $scope.estimate.married*2000 - $scope.estimate.children*1500);
			$scope.tax = {
				income: incomeTax,
				social: 1.1*incomeTax,
				medicare: .32*incomeTax,
				source: 'estimate'
			}
		}
		thenFn();
	}
});



app.directive('receipt.category', function() {
	return {
		templateUrl: 'templates/category.html',
		link: function(scope, elem, attrs) {
			scope.tooltip = {

			}
			scope.toggleCategory = function(category) {
				var toggled = !scope.category.show;
				angular.forEach(scope.budget.categories, function(cat) {
					if(cat.show) cat.show = false;
				});
				scope.category.show = toggled;
			}
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

app.directive('receipt.embedPopover', function() {
	return {
		restrict: 'A',
		template: '<i class="fa fa-code"></i>',
		link: function (scope, el, attrs) {
			$(el).popover({
				trigger: 'click',
				html: true,
				content: '<p>Copy this code to embed the taxpayer receipt tool on your website:</p><textarea cols="30" rows="5" style="width:100%; resize:none;"><iframe scrolling="no" frameborder="0" height="1975" width="700" src="http://whitehouse.github.io/apps/tax_receipt/index.html" target="_blank"></iframe></textarea>',
				placement: 'top',
				container: 'body'
			})
		}
	}
})


