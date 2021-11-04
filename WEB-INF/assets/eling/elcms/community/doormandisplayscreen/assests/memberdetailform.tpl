  <div>
  	<table width="100%">
  		<tr>
  			<td style="width:150px;" rowspan="3">
			       <small class='text-muted'>
			           <img class="img-responsive J-profile-fileupload"
			                src="assets/eling/resources/nophoto.svg" width='114' height='152'/>
			       </small>
  			</td>
            
            <td  el-data-component="personalInfo.name">
            	<label class="control-label" style="float:left;">姓名:</label>
            	<div style="width: 60%;float:left;"></div>
            </td>
            
            <td  el-data-component="personalInfo.sex.value">
           		<label class="control-label" style="float:left;">性别:</label>
            	<div style="width: 60%;float:left;"></div>
            </td>
            <td  el-data-component="age">
           		<label class="control-label" style="float:left;">年龄:</label>
            	<div style="width: 60%;float:left;"></div>
            </td>
            
        </tr>
		<tr>
			<td el-data-component="memberSigning.room.number">
				<label class="control-label" style="float:left;"> 房间号: </label>
				<div style="width: 60%;float:left;"></div>
			</td>
			<td el-data-component="memberSigning.room.telnumber" colspan="2">
           		<label class="control-label" style="float:left;" >房间电话:</label>
           		<div style="width: 60%;float:left;"></div>
           </td>
		</tr>
        <tr>
           <td el-data-component="memberSigning.checkInDate">
           		<label class="control-label" style="float:left;">入住日期:</label>
           		<div style="width: 60%;float:left;"></div>
           </td>
           <td el-data-component="memberConcernReason">
           		<label class="control-label" style="float:left;">关注原因:</label>
           		<div style="width: 60%;float:left;"></div>
           </td>
        </tr>
  	</table>
  </div>
