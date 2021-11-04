<div class="el-greenbook container">
	<div class="J-subnav"></div>
	<!-- 首页title及大纲 -->
	<header>
		<h1>健康绿皮书</h1>
		<h4>亲和源老年公寓健康管理部</h4>
	</header>
	<article class="outline">
		{{#each this.outline}}
			<section>
				<h2>{{this.main}}</h2>
				{{#each this.sub}}
				<h4>{{this}}</h4>
				{{/each}}
			</section>
		{{/each}}
	</article>
	
	<!-- 健康信息汇总 -->
	<article class="healthinfo">
		<article class="title">
			<h1>健康信息汇总</h1>
			<section>以下的内容是根据您入住亲和源时提交的健康问卷及健康体检的相关信息汇总，也是亲和源健康管理部为您提供《会员健康指导手册》的基础，谢谢您的支持、理解与配合。</section>
			<section>您在阅读以下内容时，如果发现需要修改之处，请您及时告知健康管理部，我们会立即修正。</section>
		</article>
		<article class="page-break content" style="font-size: 1.3em;">
			<h2>一、会员健康信息问卷</h2>
			{{#each this.questionnaire}}
			<section>
				<h2>{{this.type}}</h2>
				{{#each this.questions}}
					<h3>{{this.question}}</h3>
					<ul class="J-{{this.id}}">
						{{#each this.answers}}
						<li>
							 <span class="answer J-answer J-answer-{{this.id}} icon-unchecked"></span>
							 <span>{{this.name}}</span>
						</li>
						{{/each}}
					</ul>
				{{/each}}
			</section>
			{{/each}}
		</article>
		<article>
			<h2>二、会员健康体检信息</h2>
			<section class="page-break"></section>
			<h2>会员健康体检信息（2）</h2>
			<section class="page-break"></section>
		</article>
	</article>
	
	<article class="disease">
		<article class="title">
			<h1>主要疾病信息及健康指导</h1>
		</article>
		<article class="content">
			<h2>一、体检相关信息汇总</h2>
			<section class="totalDisease">
				{{#each this.diseases}}
				<span>{{this.name}}</span>
				{{/each}}
			</section>
		</article>
		<article class="page-break">
			<h2>二、主要疾病与健康指导</h2>
			<section class="content">
				{{#diseases this}}
				{{/diseases}}
			</section>
		</article>
	</article>
	
	<!--营养专项信息汇总及健康指导 -->
	<article class="nutrition">
		<article class="title">
			<h1>营养专项信息汇总及健康指导</h1>
		</article>
		<article>
			<h2>一、营养问卷信息汇总</h2>
		</article>
		<article class="page-break">
			<h2>二、营养健康专项指导</h2>
			<div class="J-healthguide-grid"></div>
		</article>
		<article class="calorie">
			<h2>三、推荐热量摄取</h2>
			<h3 class="J-calorie-text"></h3>
			<section>为了让您能理解如何摄取1900千卡的能量，我们把它转换成相应的食物重量，供您参考。</section>
			<div class="J-calorie-grid"></div>
			<section>注：上表中的食物类别指的不是某一种食物，而是包括一大类的食物。如谷类包括米、面粉及其制品，以及玉米、小米、高粱、大麦、燕麦等杂粮。</section>
		</article>
		<article class="suggest">
			<h2>四、健康食谱推荐</h2>
			<h3>为了让您在实际生活中能更好的选择食物种类和数量，下面把能量转换成具体食谱供您参考。</h3>
			<section>1900千卡能量的食谱举例：</section>
			<div class="J-suggest-grid"></div>
			<section>注：上述食谱中的食物，可以根据个人饮食习惯、当地食物供应状况、以及个人的身体状况予以调整。根据等值互换的原则，同类食物中的食品可以互换。如50克瘦猪肉可以换80克的鱼肉、50克的鸡肉等。25克的大米可以换25克的绿豆、或者是35克的生面条或者是25克的油饼等。</section>
		</article>
		<article class="exchange page-break">
			<h2>五、同类食物互换表</h2>
			<section class="J-exchange-valley-grid"></section>
			<section class="J-exchange-meat-grid"></section>
			<section class="J-exchange-vegetable-grid"></section>
		</article>
	</article>
	
	<!-- 运动专项评估及健康指导 -->
	<article class="sportsguide" style="font-size: 1.3em;">
		<h1>运动专项评估及健康指导</h1>
		<article>
			<h2>一、运动问卷信息汇总</h2>
		</article>
		<article>
			<h2>二、运动健康专项评估</h2>
			<section>您的运动评估结果：</section>
			<section>{{this.sportsdescription}}</section>
		</article>
		<article>
			<h2>三、运动健康专项指导</h2>
			<div class="J-sportsguide-grid"></div>
		</article>
		{{#each this.sports}}
		<article>
			<h2>{{this.title}}</h2>
			{{#each this.data}}
				<section>
					<h3 class="sprotguide_title">{{this.title}}</h3>
					{{#each this.contents}}
						<section class="sprotguide_content">{{this}}</section>
					{{/each}}
				</section>
			{{/each}}
		</article>
		{{/each}}
	</article>
	
	<!-- 健康常识 -->
	<article class="sportsguide" style="font-size: 1.3em;">
		<h1>健康常识</h1>
		<section>健康教育是健康管理中的一个重要环节，为了达到健康教育的目的，我们为您提供了以下的健康知识，帮助您了解什么是健康？什么是亚健康？什么是健康管理？及一些常见病的预防知识，保健知识，希望对您的健康维护起到帮助作用，让被动健康变为主动健康，让健康永远伴随您！</section>
		{{#each this.knowledge}}
			<article>
				<h2>{{this.title}}</h2>
				{{#each this.data}}
					<section>
						<h3 class="sprotguide_title">{{this.title}}</h3>
						{{#each this.contents}}
							<section class="sprotguide_content">{{this}}</section>
						{{/each}}
					</section>
				{{/each}}
			</article>
		{{/each}}
		<h1>运动锻炼，量力而行，以上建议，请根据自我情况随时调整。</h1>
	</article>
	
	<!-- 健康巡检档案 -->
	<article class="healthroute">
		<h1>健康巡检档案</h1>
		<section></section>
	</article>
</div>
    
