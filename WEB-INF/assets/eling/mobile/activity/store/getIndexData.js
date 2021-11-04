/**
 * datas: 活动列表
 * member: 当前会员
 * 
 * return {
 * 	length:活动列表长度
 * 	datas:活动列表
 * 	title:会员名称
 * }
 */
export default function getIndexData(datas,member){
    return {
    	length: datas.length,
    	datas: datas,
    	title: member.personalInfo.name
    }
}