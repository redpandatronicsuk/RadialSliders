'use strict';

/**
 * @ngdoc function
 * @name radialSlidersApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the radialSlidersApp
 */
angular.module('radialSlidersApp')
  .controller('MainCtrl', function ($scope) {
 	$scope.$watch( 'myNumSliders',
 		function(newValue, oldValue){
 			console.log('myNumSliders Changed');
 			console.log(newValue);
 			console.log(oldValue);
 		}
 		);
 	
 	$scope.myNumSliders = 8;

 	$('.hovery').blurjs({ 
    source: 'body',
    offset: { x: 15, y: -12 },
    overlay: 'rgba(0,100,100,0.1)',
    radius: 5 });
 });

