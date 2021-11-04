define(function(require,exports,module){
	var aw=require("ajaxwrapper");
	var Disease={
		getData:function(pkMember,widget){
			aw.ajax({
				url:"api/diseasehistory/query",
				data:{
					member:pkMember,
					fetchProperties:"diseaseDetail.disease.pkDisease,diseaseDetail.disease.name," +
							"diseaseDetail.disease.healthInstruction"
				},
				success:function(data){
					var map={};
					for(var i=0;i<data.length;i++){
						var diseaseDetail=data[i].diseaseDetail;
						if(diseaseDetail){
							var disease=diseaseDetail.disease;
							var pkDisease=disease.pkDisease;
							if(!map[pkDisease]){
								var temp={};
								temp.name=disease.name;
								temp.healthInstruction=disease.healthInstruction;
								map[pkDisease]=temp;
							}
						}
					}
					var model=widget.get("model");
					model.diseases=map;
					widget.renderPartial(".disease");
				}
			});
		}
	};
	
	module.exports=Disease;
});