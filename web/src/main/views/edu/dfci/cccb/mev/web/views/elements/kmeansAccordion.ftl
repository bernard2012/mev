<accordion-group heading="K-Means Clustering: {{analysis.name}}">

	Clusters: {{analysis.clusters.length}}
	
	<div ng-repeat="cluster in analysis.clusters">
		Cluster: {{cluster.id}}
		Length: {{cluster.length}}
	
	</div>
	
	<button class="btn btn-success" ng-click="applyToHeatmap()" >
        <a>
          </i> View Genes on Heatmap
        </a> 
    </button>
    <a class="btn btn-success pull-right" href="/dataset/{{project.dataset.datasetName}}/analysis/{{analysis.name}}?format=tsv">
      <i class="icon-white icon-download"></i> Download
    </a> 
</accordion-group>