'use strict';

/**
 * @ngdoc directive
 * @name radialSlidersApp.directive:RadialSlider
 * @description
 * # RadialSlider
 */
 angular.module('radialSlidersApp')
 .directive('radialSlider', function () {
 	return {
    	//template: '<svg></svg>',
    	restrict: 'E',
    	scope: { 
    		numSliders: '=',
    		startAngle: '=',
    		stopAngle: '=',
    		angleIncrement: '=',
    		initialValues: '=',
    		stepSliders: '=',
    		sliderPrefix: '=',
    		colors: '='
    	},
    	link: { 
    		post: function postLink(scope, element, attrs) {
    			console.log(attrs);
	      		// Make main svg rectangle:
	      		function initSVG() {
	      			svg = d3.select('#' + element[0].id)
	      			.append('svg')
	      			.attr('viewBox', '0 0 600 600')
	      			.attr('style', 'width: 300px; height: 300px;');
	      		}

				// Drag behaviourkey: "value", 
				function initDrag() {
					drag = d3.behavior.drag()
					.origin(Object)
					.on('drag', dragMove)
					.on('dragend', dragEnd);//postLink);//
}

				// Make and draw background radial gradient:
				function initRadialGradient(id) {
					defs = svg.append('svg:defs');
					defs.append('svg:radialGradient')
					.attr('spreadMethod','pad')
					.attr('r', 0.5).attr('cx', 0.5).attr('cy', 0.5)
					.attr('id', 'rdlGrdnt-' + id).call(
						function(gradient) {
							gradient.append('svg:stop').attr('id','rgInner').attr('offset', '0').attr('stop-color', '#ffff00').attr('stop-opacity',1);
							gradient.append('svg:stop').attr('id','rgMiddle').attr('offset', '0.5').attr('stop-color', '#ff6600').attr('stop-opacity',0.8);
							gradient.append('svg:stop').attr('id','rgOuter').attr('offset', '1').attr('stop-color', '#0000ff').attr('stop-opacity',0.01);
						});
					svg.append('circle').attr('id','rgCirc').attr('r', 300).attr('cx', 300).attr('cy', 300).attr('stroke-linecap', 'null').attr('stroke-linejoin', 'null').attr('stroke-dasharray', 'null').attr('stroke-width', 0).attr('fill','url(#rdlGrdnt-' + id + ')');
				}

				function init(id) {
					numFormatter = d3.format('.1f');
					initSVG();
					initDrag();
					initRadialGradient(id);
				}

				function getValue(list, idx) {
					if (Array.isArray(list)) {
						return list[idx];
					} else {
						return list;
					}
				}

				var prefix;
				if (attrs.sliderPrefix) {
					prefix = attrs.sliderPrefix;
				} else {
					prefix = 'sl';
				}

				var initialValues;	
				if (scope.initialValues) {
					initialValues = scope.initialValues;
				} else {
					initialValues = 50;
				}

				var stepSliders = [];
				if (scope.stepSliders) {
					scope.stepSliders.forEach(function(stepSlider) {
						stepSliders.push(prefix + stepSlider.toString());
					});
				}

				var sliderColors;
				if (scope.colors) {
					sliderColors = scope.colors;
				} else {
					sliderColors = ['#003300','#009933', '#66CC33', '#009966', '#0099CC', '#0099FF', '#0066CC', '#330099', '#990066', '#990000', '#CC0000', '#FF6600', '#FFFF00', '#000000', '#FFFFFF'];
				}
				stepSliders = d3.set(stepSliders);
				var svg, drag, defs, numFormatter, sliderValues = {};
				init(prefix);
				// From input variables create slider object:
				var slidersAverage = 50;
				var numSliders = scope.numSliders;
				var angleIncrement;
				if (scope.angleIncrement) {
					angleIncrement = scope.angleIncrement;
				} else {
					angleIncrement = 360 / (numSliders);
				}

				var startAngle;
				if (scope.startAngle) {
					startAngle = scope.startAngle;
				} else {
					startAngle = 0;
				}

				var stopAngle;
				if (scope.stopAngle) {
					stopAngle = scope.stopAngle;
				} else {
					stopAngle = startAngle + angleIncrement * numSliders;
				}

				var stopInclusive = false;
				var inclusiveFix = 0;
				if (stopInclusive) {
					inclusiveFix = 0.000001;
				}

				var sliderAngles = d3.range(startAngle, stopAngle, angleIncrement);

				sliderAngles.forEach(function(rotAngle,i) {
					var tmpId = prefix + i;
					var sliderValue = getValue(initialValues, i);
					sliderValues[tmpId] = sliderValue;
					// Make one petal and rotate to correct location:
					var tmpSlider = svg.selectAll('svg').data([{x: 50, y : 0}]).enter().append('g').attr('transform', 'translate(300, 300) rotate(' + rotAngle +') translate(75, 0)');
					// Draw outline of petal first and then petal above:
					tmpSlider.append('path').attr('stroke',sliderColors[i]).attr('stroke-width',25).attr('stroke-linejoin', 'round').attr('d','M-10,16l175.51,39.684v-0.445 c17.498-32.229,17.498-81.838,0-110.923L-10-16');
					// Make gradeint and draw coloured petal:
					makeGradientDef(tmpId);
					tmpSlider.append('path').attr('fill','url(#' + prefix + i + 'gr)').attr('d','M-10,16l175.51,39.684v-0.445 c17.498-32.229,17.498-81.838,0-110.923L-10-16')
					.attr('stroke-linecap', 'null').attr('stroke-linejoin', 'null').attr('stroke-dasharray' ,'null');

					// Make group for draggable slider:
					var sldG = tmpSlider.append('g').call(drag).attr('transform','scale(0.8)').attr('id', prefix + i);
					// Draw smiley face circle:
					sldG.append('circle').attr('r', 30).attr('cx', function(d) { return d.x; }).attr('cy', function(d) { return d.y; }).attr('fill', sliderColors[i]);

					// Make group for face (mouth, eyes) and translate to center of face:
					var tmpSmile = sldG.append('g').attr('transform', 'translate(19, -32)').attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round');
					// Mouth:
					tmpSmile.append('path').attr('id', prefix + i + 'sml').attr('fill','none').attr('stroke','black').attr('d', 'M 17 42 q 16 0 30 0').attr('stroke-width', 5);
					// Left eye:
					tmpSmile.append('path').attr('d', 'm 25.2456,20.818995 a 4.2934899,4.2512827 0 1 1 -8.58698,0 4.2934899,4.2512827 0 1 1 8.58698,0 z').attr('transform', 'translate(2,0)');
					// Right eye:
					tmpSmile.append('path').attr('d', 'm 25.2456,20.818995 a 4.2934899,4.2512827 0 1 1 -8.58698,0 4.2934899,4.2512827 0 1 1 8.58698,0 z').attr('transform', 'translate(20.09578,-5.2209472e-7)');
					// Face circle:
					tmpSmile.append('path').attr('fill','none').attr('stroke','black').attr('stroke-width',5).attr('d','m 59.013798,30.326033 a 28.596857,28.596857 0 1 1 -57.1937144,0 28.596857,28.596857 0 1 1 57.1937144,0').attr('transform', 'translate(1.5830593,1.5830584)');
					// Percentage text:
					tmpSlider.append('text').attr('id', prefix + i + 'tx').text( function(d) { return d.x; }).attr('x', function(d) { return d.x; }).attr('y', function(d) { return d.y+15; }).attr('text-anchor','middle').attr('alignment-baseline', 'middle').attr('visibility','hidden');

					moveSlider(sliderValue, sldG[0][0]);
				});

				//*********************************************** BIG SMILEY ***************************************************/
				var smiley = svg.selectAll('svg').data([{text: slidersAverage}]).enter().append('g').attr('transform', 'translate(300, 300)');
				smiley.append('text').text(function(d){return d.text;}).attr('id', 'slidersAvg').attr('fill', sliderColors[9]).attr('font-size', '25px').attr('text-anchor','middle').attr('alignment-baseline', 'middle');
				var smileyFace = smiley.append('g').attr('transform', 'translate(-30, -30)').attr('stroke-linecap', 'round', 'stroke-linejoin', 'round');
				smileyFace.append('path').attr('id', 'avgSml').attr('fill','none').attr('stroke','black').attr('d', 'M 17 42 q 16 0 30 0').attr('stroke-width', 5);
				smileyFace.append('path').attr('d', 'm 25.2456,20.818995 a 4.2934899,4.2512827 0 1 1 -8.58698,0 4.2934899,4.2512827 0 1 1 8.58698,0 z').attr('transform', 'translate(2,0)');
				smileyFace.append('path').attr('d', 'm 25.2456,20.818995 a 4.2934899,4.2512827 0 1 1 -8.58698,0 4.2934899,4.2512827 0 1 1 8.58698,0 z').attr('transform', 'translate(20.09578,-5.2209472e-7)');
				smileyFace.append('path').attr('fill','none').attr('stroke','black').attr('stroke-width',5).attr('d','m 59.013798,30.326033 a 28.596857,28.596857 0 1 1 -57.1937144,0 28.596857,28.596857 0 1 1 57.1937144,0').attr('transform', 'translate(1.5830593,1.5830584)');
				//*********************************************** BIG SMILEY END ***********************************************/

				function moveSlider(x, that) {
					var mCx = x - 50;
					var mS = (x+25) * 0.01;
					d3.select(that)
					.attr('opacity', 0.6)
					.attr('transform', 'scale(' + mS + ') translate(' + mCx + ', 0)');
					// Update slider value in array of all slider values:
					sliderValues[that.id] = x;
					// Update smile on slider:
					svg.select('#' + that.id + 'sml').attr('d','M 17 42 q 16 ' + smileValue(x) + ' 30 0');
					// Update background gradient:
					svg.select('#' + that.id + 'gr1').attr('offset', x * 0.01);
					// Update smile in center:
					var tmpAvg = calculateAvg();
					svg.select('#slidersAvg').text(numFormatter(tmpAvg));
					svg.select('#avgSml').attr('d', 'M 17 42 q 16 ' + smileValue( tmpAvg ) + ' 30 0');
					// Update radial gradient:
					svg.select('#rgMiddle').attr('offset', tmpAvg * 0.01);
				}

				function dragMove(d) {
					/*jshint validthis: true */
					d.y = 0;
					d.x = Math.max(0, Math.min(100, d3.event.x));
					if (stepSliders.has(this.id)) {
						d.x = Math.round(d.x*0.1)*10;
					}
					// Update slider text:
					svg.select('#' + this.id + 'tx')
					.attr('visibility','visible')
					.attr('x', d.x)
					.text(Math.round(d.x) + '%')
					.attr('font-size', (d.x * 0.5 + 10)+'px');
					moveSlider(d.x, this);
				}

				function smileValue(inVal) {
					return ((inVal * 0.35) - 17.5);
				}

				function calculateAvg() {
					return d3.mean(d3.values(sliderValues));
				}

				function dragEnd() {
					/*jshint validthis: true */
					d3.select(this).attr('opacity', 1);
					svg.select('#' + this.id + 'tx').attr('visibility','hidden');
				}

				function makeGradientDef(id) {
					// Make def for gradient:
					defs.append('svg:linearGradient')
					.attr('spreadMethod','pad')
					.attr('x1', 0).attr('y1', 0).attr('x2', 1).attr('y2', 0)
					.attr('id', id + 'gr').call(
						function(gradient) {
							gradient.append('svg:stop').attr('id', id + 'gr1').attr('offset', '0.5').attr('stop-color', '#0099ff').attr('stop-opacity',1);
							gradient.append('svg:stop').attr('offset', '1').attr('stop-color', '#330099').attr('stop-opacity' ,1);
						});
				}
			}
		}
	};
});
