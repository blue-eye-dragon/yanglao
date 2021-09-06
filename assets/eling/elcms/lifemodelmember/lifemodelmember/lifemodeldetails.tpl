
    <div class="main" style="border:1px solid #ccc;padding:20px 32px;">
        <div class="main_box row">
            <!-- 人物信息 -->
            <div class="left_box row">
                <div style="overflow:hidden;">
                <div class="userName ml70">
                                    <img class="main_img" src="{{this.img}}" alt="" style="border: 4px solid #fff;box-shadow: 0px 10px 10px #ddd;">
                                    <span class="fs18 ml20">{{this.name}}{{#if this.nameEn}}（{{this.nameEn}}）{{/if}}</span>
                                    <p class="ml20" style="color:#666">{{this.sex}}&nbsp;&nbsp;{{this.age}} 岁</p>
                                    <p class="ml20" style="color:#666">{{this.birthdayString}}</p>
                                </div>
                                <div class="userMesssage">
                                    <span>亲和源.康桥老年公寓</span>
                                    <p>{{this.number}}</p>
                                    <p>{{this.phone}}</p>
                                    <p style="margin-top:50px;margin-bottom:8px;">{{this.specialty}}</p>
                                    <p>{{this.maritalStatus}}</p>
                                    <p>{{this.medicalInsuranceType}}</p>
                                </div>
                </div>
                <div class="foot">
                    <div>
                        <img class="smallimg" src="assets/eling/elcms/lifemodelmember/lifemodelmember/right.png" alt="">
                        <h3>会员特征</h3>
                        <img class="smallimg" src="assets/eling/elcms/lifemodelmember/lifemodelmember/left.png" alt="">
                    </div>
                    <div class="self_btn row" style="margin:0;padding-left: 10px;text-align:left;">
                        {{#if this.basicFeatureMember.tastePreference.value}}
                            <button>{{this.basicFeatureMember.tastePreference.value}}</button>
                        {{/if}}
                        {{#if this.basicFeatureMember.nature.value}}
                            <button>{{this.basicFeatureMember.nature.value}}</button>
                        {{/if}}
                        {{#if this.basicFeatureMember.actionPower.value}}
                            <button>{{this.basicFeatureMember.actionPower.value}}</button>
                        {{/if}}
                        {{#if this.basicFeatureMember.dietTaboo}}
                            <button>{{this.basicFeatureMember.dietTaboo}}</button>
                        {{/if}}
                        {{#if this.basicFeatureMember.hobbiesAndInterests}}
                            <button>{{this.basicFeatureMember.hobbiesAndInterests}}</button>
                        {{/if}}
                    </div>
                </div>
            </div>

            <!-- 椭圆 -->
            <div class="right_box row" id="right_box">
                <div style="position:absolute; left:0px; height:100%; padding:0;" id="flexBorder">
                    <div id="top" style="width:100%; background: #f08a8a; padding:0;"></div>
                    <div id="middle" style="width:100%;  background: #efae34;padding:0;"></div>
                    <div id="bottom" style="width:100%;  background: #30baae;padding:0;"></div>
                </div>
                <div class="col" id="col_top">
                    {{#if this.drink}}
                        <button class="one three"><span><span>{{this.drink}}</span></span></button>
                    {{/if}}
                    {{#if this._drink}}
                        <button class="three"><span><span>{{this._drink}}</span></span></button>
                    {{/if}}

                    {{#if this.workAndRest}}
                        <button class="one three"><span><span>{{this.workAndRest}}</span></span></button>
                    {{/if}}
                    {{#if this._workAndRest}}
                        <button class="three"><span><span>{{this._workAndRest}}</span></span></button>
                    {{/if}}

                    {{#if this.selfCareAbility}}
                        <button class="one three"><span><span>{{this.selfCareAbility}}</span></span></button>
                    {{/if}}
                    {{#if this._selfCareAbility}}
                        <button class="three"><span><span>{{this._selfCareAbility}}</span></span></button>
                    {{/if}}

                    {{#if this.consumptionCiew}}
                        <button class="one three"><span><span>{{this.consumptionCiew}}</span></span></button>
                    {{/if}}
                    {{#if this._consumptionCiew}}
                        <button class="three"><span><span>{{this._consumptionCiew}}</span></span></button>
                    {{/if}}

                    {{#if this.smokingStatus}}
                        <button class="one three"><span><span>{{this.smokingStatus}}</span></span></button>
                    {{/if}}
                </div>
                <div class="col" id="col_middle">
                    {{#if this.takeExercise}}
                        <button class="one five"><span><span>{{this.takeExercise}}</span></span></button>
                    {{/if}}
                    {{#if this._takeExercise}}
                        <button class="five"><span><span>{{this._takeExercise}}</span></span></button>
                    {{/if}}

                    {{#if this.tourism}}
                        <button class="one five"><span><span>{{this.tourism}}</span></span></button>
                    {{/if}}
                    {{#if this._tourism}}
                        <button class="five"><span><span>{{this._tourism}}</span></span></button>
                    {{/if}}

                    {{#if this.interpersonal}}
                        <button class="one five"><span><span>{{this.interpersonal}}</span></span></button>
                    {{/if}}
                    {{#if this._interpersonal}}
                        <button class="five"><span><span>{{this._interpersonal}}</span></span></button>
                    {{/if}}
                </div>
                <div class="col"  id="col_bottom">
                    {{#if this.coronaryDisease}}
                        <button class="one"><span><span>{{this.coronaryDisease}}</span></span></button>
                    {{/if}}

                    {{#if this.osteoporosis}}
                        <button class="one"><span><span>{{this.osteoporosis}}</span></span></button>
                    {{/if}}
                    {{#if this._osteoporosis}}
                        <button>{{this._osteoporosis}}</button>
                    {{/if}}

                    {{#if this.diabetes}}
                        <button class="one"><span><span>{{this.diabetes}}</span></span></button>
                    {{/if}}
                    {{#if this._diabetes}}
                        <button>{{this._diabetes}}</button>
                    {{/if}}

                    {{#if this.tumour}}
                        <button class="one"><span><span>{{this.tumour}}</span></span></button>
                    {{/if}}
                    {{#if this._tumour}}
                        <button>{{this._tumour}}</button>
                    {{/if}}

                    {{#if this.senileDementia}}
                        <button class="one"><span><span>{{this.senileDementia}}</span></span></button>
                    {{/if}}
                    {{#if this._senileDementia}}
                        <button>{{this._senileDementia}}</button>
                    {{/if}}

                    {{#if this.hearing}}
                        <button class="one"><span><span>{{this.hearing}}</span></span></button>
                    {{/if}}
                    {{#if this._hearing}}
                        <button>{{this._hearing}}</button>
                    {{/if}}

                    {{#if this.vision}}
                        <button class="one"><span><span>{{this.vision}}</span></span></button>
                    {{/if}}
                    {{#if this._vision}}
                        <button>{{this._vision}}</button>
                    {{/if}}

                    {{#if this.hypertension}}
                        <button class="one"><span><span>{{this.hypertension}}</span></span></button>
                    {{/if}}
                    {{#if this._hypertension}}
                        <button>{{this._hypertension}}</button>
                    {{/if}}

                    {{#if this.heartDisease}}
                        <button class="one"><span><span>{{this.heartDisease}}</span></span></button>
                    {{/if}}
                    {{#if this._heartDisease}}
                        <button>{{this._heartDisease}}</button>
                    {{/if}}
                </div>
            </div>
        </div>
        <fieldset class="area_box messageBox" title="兴趣小组">

	        <div class="area_main">{{this.interestgroup}}</div>
	    </fieldset>
        <fieldset class="area_box messageBox" title="服务备忘录">
	        <div class="area_main">{{this.basicFeatureMember.memorandum}}</div>
	    </fieldset>
    </div>
    <script>
        var topList = document.querySelector("#right_box #col_top");
        var middleList = document.querySelector("#right_box #col_middle");
        var bottomList = document.querySelector("#right_box #col_bottom");
        var parentDom = document.querySelector("#right_box");
        var parentDomH = 0;
        var flexTop = document.querySelector("#right_box #flexBorder #top");
        var flexMiddle = document.querySelector("#right_box #flexBorder #middle");
        var flexBottom = document.querySelector("#right_box #flexBorder #bottom");
        console.dir(parentDom);
        console.log(parentDomH);
        var _top = 0; var _middle = 0; var _bottom = 0;
        topList ? _top = topList.children.length : _top = 0;
        middleList ? _middle = middleList.children.length : _middle = 0;
        bottomList ? _bottom = bottomList.children.length : _bottom = 0;

        if(_top + _bottom + _middle != 0){
            var topNum = _top / (_top + _middle + _bottom);
            var middleNum = _middle / (_top + _middle + _bottom);
            var bottomNum = _bottom / (_top + _middle + _bottom);
            setTimeout(function(){
                parentDomH = parentDom.offsetHeight;
                flexTop.style.height = topNum * parentDomH + 'px';
                flexMiddle.style.height = middleNum * parentDomH + 'px';
                flexBottom.style.height = bottomNum * parentDomH + 'px';

            },0);
        }


    </script>