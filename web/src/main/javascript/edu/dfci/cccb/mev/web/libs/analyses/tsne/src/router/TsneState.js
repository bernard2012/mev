define(["./TsneState.tpl.html", "./TsneStateVM"], function(template, TsneStateVM){ "use strict";
	function TsneState($stateProvider){
		$stateProvider
	 		.state("root.dataset.analysisType.tsne", {
	 			parent: "root.dataset.analysisType",
	 			url: "tsne/{analysisId}",
	 			template: template,	   	     			
	 			controller: ["$scope", "project", "analysis", "TsneStateVMFactory", function(scope, project, analysis, TsneStateVMFactory){
	 				return TsneStateVMFactory.call(this, scope, project, analysis);
	 			}],
	 			controllerAs: "DatasetAnalysisVM",	 			
				displayName: "{{analysis.name}} analysis",
	 			resolve:{
	 				analysis: function($stateParams, dataset){
	 					return _.find(dataset.analyses, function(analysis){ return analysis.name===$stateParams.analysisId; });															
	 				}
	 			}
	 		});
	}
	TsneState.inject=["$stateProvider"];
	TsneState.provider="config";
	return TsneState;
});