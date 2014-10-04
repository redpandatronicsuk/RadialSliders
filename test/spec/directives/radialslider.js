'use strict';

describe('Directive: RadialSlider', function () {

  // load the directive's module
  beforeEach(module('radialSlidersApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  // it('should make hidden element visible', inject(function ($compile) {
  //   element = angular.element('<-radial-slider></-radial-slider>');
  //   element = $compile(element)(scope);
  //   expect(element.text()).toBe('this is the RadialSlider directive');
  // }));
});
