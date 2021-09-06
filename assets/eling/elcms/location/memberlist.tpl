<div class='J-member-locStatus hidden'></div>
<p>&nbsp;&nbsp;&nbsp;&nbsp;<i class="icon-exclamation" style="font-size:16px;padding-right:2px;color:red"></i> : 室内超过24小时
&nbsp;&nbsp;&nbsp;&nbsp;<i class="icon-plane" style="font-size:16px;padding-right:2px;color:orange"></i> : 疑似外出
&nbsp;&nbsp;&nbsp;&nbsp;<i class="icon-credit-card" style="font-size:16px;padding-right:2px;color:grey"></i> : 无定位卡
&nbsp;&nbsp;&nbsp;&nbsp;<i class="icon-ban-circle" style="font-size:16px;padding-right:2px;color:grey"></i> : 无定位信息</p>
{{#each this}}
<li class="item col-md-4" data-key="{{this.pkMember}}" data-person="{{this.personalInfo.pkPersonalInfo}}" data-locStatus="{{this.locStatus.key}}">
	<label class="check pull-left todo">
    	<span>{{this.memberSigning.room.number}} {{this.personalInfo.name}} </span>
    	{{#if this.danger}}
    	<i class="icon-exclamation" style="font-size:16px;padding-right:2px;color:red"></i>
    	{{/if}}
    	{{#if this.isOut}}
    	<i class="icon-plane" style="font-size:16px;padding-right:2px;color:orange"></i>
    	{{/if}}
    	{{#if this.noCard}}
    	<i class="icon-credit-card" style="font-size:16px;padding-right:2px;color:grey"></i>
    	{{/if}}
    	{{#if this.noData}}
    	<i class="icon-ban-circle" style="font-size:16px;padding-right:2px;color:grey"></i>
    	{{/if}}
  	</label>
</li>
{{/each}}
<p>$nbsp;</p>