<style>
	.list-group-item{
		color: #337ab7;
	}
</style>
<div class="J-listview-list fixed">
	<div class="fixed-title">
		<div class="h1 J-showsidebar text-center pull-left sidebaricon">
			<i class="icon-align-justify"></i>
		</div>
		<h1 class="text-center">{{this.headerbar.title}}</h1>
	</div>
	{{#if this.list.title}}
	<div class="container fixed-content with-title">
	{{else}}
	<div class="container fixed-content">
	{{/if}}
		<div class="row">
			<div class="col-xs-12">
				<div class="panel panel-default">
					<div class="panel-heading text-center">{{this.list.title}}</div>
					<ul class="list-group"></ul>
				</div>
			</div>
		</div>
	</div>
</div>