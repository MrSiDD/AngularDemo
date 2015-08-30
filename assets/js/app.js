var app = angular.module('app', ['ui.router']);

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
			dessert: obj.dessert
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

app.controller('ChildrenController', function() {
	var self = this;
	self.children = [];

	this.addChild = function(child) {
		self.children.push(child);
	};

	this.switchChild = function(theNewChild, openNewChild) {
		angular.forEach(this.children, function(child) {
			child.ctrl.selected = false;
	    });
	    if (openNewChild) {
		    theNewChild.selected = true;
		}
	};
});

app.controller('ChildController', function($scope) {
	var self = this;
	this.selected = false;
	this.days = {
		monday: {},
		tuesday: {},
		wednesday: {},
		thursday: {},
		friday: {}
	};

	this.openChild = function() {
		$scope.parentCtrl.switchChild(this, !self.selected);	
	};
});

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
			childrenList: '=children' // internal variable name differs from outside attribute
		},
		restrict: 'E',
		replace: true,
		templateUrl: './assets/html/children.html',
		controller: 'ChildrenController as ctrl'
	}
});

app.directive('demoChild', function() {
	return {
    	require: '^demoChildren',
		scope: {
			child: '=',
			name: '='
		},
		restrict: 'E',
		replace: true,
		templateUrl: './assets/html/child.html',
		controller: 'ChildController as ctrl', 
		link: function(scope, element, attrs, parentCtrl) {
			parentCtrl.addChild(scope);
			scope.parentCtrl = parentCtrl;
		}
	}
});

app.directive('demoFood', function() {
	return {
		scope: {
			food: '=',
			foodUpdate: '&update' // set callback method
		},
		restrict: 'E',
		replace: true,
		templateUrl: './assets/html/food.html',
		controller: 'FoodController as ctrl'
	}
});

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('home', {
    //controller: 'CitiesController as citiesCtrl',
    templateUrl: './assets/html/state-home.html',
    url: '/'
  });  
  $stateProvider.state('food', {
    //controller: 'CitiesController as citiesCtrl',
    templateUrl: './assets/html/state-food.html',
    url: '/food'
  });
  $stateProvider.state('children', {
    //controller: 'CitiesController as citiesCtrl',
    templateUrl: './assets/html/state-children.html',
    url: '/children'
  });

  $urlRouterProvider.otherwise('/');

});