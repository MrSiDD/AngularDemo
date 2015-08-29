var app = angular.module('app', []);

app.service('demoService', function($http) {
	var self = this;
	self.children = [];
	self.food = {};

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

app.controller('AppController', function(demoService, $q) {
	var self = this;
	var food = demoService.getFood();

	self.children = [];

	$q.all([demoService.getChildren()])
		.then(function(responses) {
			self.children = responses[0];
		});

	this.updateFood = function(obj) {
		demoService.setFoodForDay(obj);
	};
});

app.controller('ChildrenController', function() {});

app.controller('ChildController', function() {});

app.controller('FoodController', function(demoService, $scope) {
	var self = this;
	self.food = demoService.getFood();
	self.foodEntry = null;
	self.foodReady = false;

	this.addFood = function() {
		$scope.foodUpdate({obj: self.foodEntry});
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
		scope: {
			childrenList: '=children'
		},
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
		scope: {
			food: '=',
			foodUpdate: '&update'
		},
		restrict: 'E',
		replace: true,
		templateUrl: './assets/html/food.html',
		controller: 'FoodController as ctrl'
	}
});