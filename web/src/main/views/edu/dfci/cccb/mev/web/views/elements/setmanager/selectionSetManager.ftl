
<div id="setmanagerAccordion" class="accordion">

	<div class="accordion-group">
		<div class="accordion-heading" ng-dblclick="sayHelloCtl()">
			<a class="accordion-toggle" data-toggle="collapse"
				href="#collapseSetManagerColumns"> Column Sets </a>			
		</div><!-- End Heading Div -->

		<div id="collapseSetManagerColumns" class="accordion-body collapse">
			<div class="accordion-inner">
				<selection-set-list 
					mev-selections="heatmapData.column.selections" 
					mev-base-url="/annotations/{{heatmapId}}/annotation/column"
					mev-demintion="column">
					You may define sets using <a href="" ng-click="showAnnotations(selection, 'column')">column annotations</a> or by performing a clustering analysis.				
				</selection-set-list>				
			</div>
		</div><!-- End Accordion Body -->
	</div><!-- End Accordion Grouping -->


	<div class="accordion-group">

		<div class="accordion-heading">
			<a class="accordion-toggle" data-toggle="collapse"
				href="#collapseSetManagerRows"> Row Sets </a>
		</div>		

		<div id="collapseSetManagerRows" class="accordion-body collapse">
			<div class="accordion-inner">
			
				<selection-set-list 
					mev-selections="heatmapData.row.selections" 
					mev-base-url="/annotations/{{heatmapId}}/annotation/row"
					mev-demintion="row">
					You may define sets uploading your <a href="" ng-click="showAnnotations(selection, 'row')">row annotations</a> or by looking up <a href="" ng-click="showAnnotations(selection, 'row', 'probe')">probe annotations</a> from our database.				
				</selection-set-list>
				
		</div>
		</div><!-- End Accordion Body -->
	</div><!-- End Accordion Grouping -->

</div><!-- End Accordion Definition -->

