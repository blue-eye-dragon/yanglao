define(["moment","zepto"],function(){
	var cache = {};
	
	var ElingUtils = {
		getParameter:function(id){
			var search=window.location.search.substr(1);
		    var m = search.match(new RegExp(id+"=([^&]*)"));
		    return m ? m[1] : "";
		},
		//TODO:后续要切换成可以选择会员
		getDemoPKMember:function(){
			var pkMember="";
			$.ajax({
				url:"api/member/queryRelatedMembers",
				async:false,
				data:{
					pkPersonalInfo : this.getParameter("pkPersonalInfo"),
					fetchProperties:"pkMember,personalInfo.name,memberSigning.room.number"
				},
				success:function(data){
					pkMember = data[0].pkMember;
				}
			});
			return pkMember;
		},
		setCache : function(key,value){
			cache[key] = value;
		},
		getCache : function(key){
			return cache[key];
		},
		animate:function(node,left){
			$(node).animate({
				left:left+"px"
			},"fast");
		},
		loading:function(mark){
    		if(mark){
    			var div = $("<div></div>").addClass("masking").addClass("J-loading-masking");
    			var img = $("<img>").attr("src","../../../assets/eling/resources/ajaxloader/ajaxloader.gif");
    			var imgDiv=$("<div></div>").addClass("loading").addClass("J-loading-img").append(img);
    			$("body").append(div);
    			$("body").append(imgDiv);
    		}else{
    			$(".J-loading-masking,.J-loading-img").remove();
    		}
    	},
	};
	
	return ElingUtils;
});