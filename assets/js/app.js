var app = angular.module('app', []);

app.service('demoService', function($http) {
	var self = this;
	self.children = [];
	self.food = {};/*{saturday: {
		soup: 'sat soup',
		lunch: 'sat lunch',
		desert: 'sat desert'
	}};*/

	this.getChildren = function() {
		return $http
					.get('./assets/data.json')
					.then(function(response) {
						self.children = response.data.data;

						return self.children;
					});
	};

	this.getFood = function() {
		return self.food;
	}

	this.setFoodForDay = function(obj) {
		self.food[obj.day] = {
			soup: obj.soup,
			lunch: obj.lunch,
			desert: obj.desert
		};
	};
});

app.controller('AppController', function() {});

app.controller('ChildrenController', function(demoService, $q) {
	var self = this;
	self.children = [];

	$q.all([demoService.getChildren()])
		.then(function(responses) {
			self.children = responses[0];
		});

});

app.controller('ChildController', function($scope) {
	$scope.getChild = function() {
		return $scope.child;
	};
});

app.controller('FoodController', function(demoService) {
	var self = this;
	self.food = demoService.getFood();
	self.foodEntry = null;
	self.foodReady = false;

	this.addFood = function() {
		demoService.setFoodForDay(self.foodEntry);
		self.foodEntry = {};

		self.foodReady = true;
	};

	this.changeDay = function() {
		var day = self.foodEntry.day;
		self.foodEntry = self.food[self.foodEntry.day] || {};
		self.foodEntry.day = day;
	};
});

app.directive('demoChildren', function() {
	return {
		scope: {},
		restrict: 'E',
		replace: true,
		templateUrl: './assets/html/children.html',
		controller: 'ChildrenController as ctrl'
	}
});

app.directive('demoChild', function() {
	return {
		scope: {
			child: '='
		},
		restrict: 'E',
		replace: true,
		templateUrl: './assets/html/child.html',
		controller: 'ChildController as ctrl'
	}
});

app.directive('demoFood', function() {
	return {
		scope: {},
		restrict: 'E',
		replace: true,
		templateUrl: './assets/html/food.html',
		controller: 'FoodController as ctrl'
	}
});