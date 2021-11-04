<div class="main" style="border:1px solid #ccc;padding:10px;font-family:'黑体'">
<div class="ul_box">
    <ul class="year_ul">
        {{#each this}}
            <li class="{{bgc}}">
                <div style="display:inline-block">
                    <b class="fl">{{this.age}}</b>
                    <div class="fl" style="margin-top:10px;">
                        <span class="colorGreen">{{this.lifeDetail}}</span>
                        <span class="colorBlue">{{this.happyDetail}}</span>
                        <span>{{this.healthyDetail}}</span>
                    </div>
                </div>
            {{/each}}
        </li>
    </ul>
</div>
</div>