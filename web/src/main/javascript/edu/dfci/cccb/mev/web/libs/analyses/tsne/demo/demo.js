define(["mui", "mev-tsne",
    "../data/tsne_result.json",
	"mev-dataset/src/main/dataset/lib/AnalysisClass",
	"angular-ui-bootstrap", "bootstrap/dist/css/bootstrap.css",
	"mev-analysis",
	"mev-mock",
	"bootstrap",
	"bootstrap/dist/css/bootstrap.min.css"
	], 
function(ng, tsnemod, tsneResult, AnalysisClass){"use strict";
	return ng.module("app", arguments, arguments)	
	.controller("tsneDemoCtrl", ["$scope", "mevTsneAnalysisType", function($scope, mevTsneAnalysisType){
		var _self = this;
		$scope.analysis=tsneResult;
		$scope.analysisType=mevTsneAnalysisType;
		console.debug("analysis", $scope.analysis);
	}])
	.run(["$state", "mevMockProject", function($state, mevMockProject){
		mevMockProject.dataset.analyses.push(new AnalysisClass(tsneResult));
		$state.go("root.dataset.analysisType.tsne", {datasetId: mevMockProject.dataset.id, analysisId: tsneResult.name});
	}]);
});
