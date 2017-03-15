define(["lodash"], function(_){ "use strict";
	function TsneStateVMFactory(mevAnalysisTypes){
		function factory(scope, project, analysis){
			var _self = this;
			this.project = project;
			this.analysis = analysis;
			this.curSelection = [];
			this.curGroups = [];
			this.curSelections = [];
			this.analysisTypes = mevAnalysisTypes.all();
		  	this.getSelection=function(){
		  		return _self.curSelection;
		  	};

		  	/*this.analysis.getExperiment=function(){
				return _self.curGroups[0];
			};
			this.analysis.getControl=function(){
				return _self.curGroups[1];;
			};*/
			this.analysis.getSelections=function(){
				return _self.curSelections;
			}
		  	scope.sizeChanged=function(){
	    		console.debug("tsne resize");
	    		window.dispatchEvent(new Event('resize'));
	    	};
			function getFields(y){
				var sampleNames = Object.keys(y);
				var firstSample = y[sampleNames[0]];
                return Object.keys(firstSample);
			}
			scope.vm = {
                xLabel: "PC1",
                yLabel: "PC2",
                logScaleX: false,
                logScaleY: false,
                dragAction: "select",
                fields: getFields(_self.analysis.y)
            };
            scope.$on("mev.scatterPlot.selection", function($event, selected){
                _self.curSelection.length = 0;
                selected.items.map(function(item){
                    _self.curSelection.push(item);
                });
            });

	    	scope.$on("mui:dashboard:panel:rowMax", scope.sizeChanged);
			scope.$on("mui:dashboard:panel:rowMin", scope.sizeChanged);
			scope.$on("mui:dashboard:panel:max", scope.sizeChanged);
			scope.$on("mui:dashboard:panel:min", scope.sizeChanged);

		}
		factory.$inject=["$scope", "project", "analysis"];		
		return factory;
	}	
	TsneStateVMFactory.$inject=["mevAnalysisTypes"];
	TsneStateVMFactory.$name="TsneStateVMFactory";
	TsneStateVMFactory.$provider="factory";
	return TsneStateVMFactory;
});