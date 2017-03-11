/*1.获取类名的兼容函数

思路：1.如果浏览器支持 直接输出
	  2.如果浏览器不支持
	    首先获取所有标签
	    然后找到所有含类名的标签
	    最终对比和要查找的类名是否相等

	  getClass("box");
	  getClass("box")[2];

*/
function getClass(classname,obj){	// classname 是要查找的类名，obj是查找范围
	obj=obj||document;		// 参数初始化
	if(obj.getElementsByClassName){
		return obj.getElementsByClassName(classname);
	}else{
		var newarr=[];
		var all=obj.getElementsByTagName("*");
		
		for(var i=0;i<all.length;i++){
			if(check(all[i].className,classname)){
				newarr.push(all[i]);	// push从末尾添加元素，返回数组添加后的长度。
			}
		}
		return newarr;		
	}
}
function check(classname,val){		// calssname 是所有含类名的标签，val 是要查找的类名
	var arr=classname.split(" ");	// split把空格转化为数组	"aa bb"转化为["aa","bb"]
	for(var i=0;i<arr.length;i++){	
		if(arr[i]===val){
			return true;
		}
	}
	return false;
}



/******************************************************/


/*2.获取样式的兼容函数
	obj:获取哪一个对象
	attr：属性名
	
	getStyle(div,width)
*/

function getStyle(obj,attr){
	if(obj.currentStyle){			// 可以获取到元素的当前样式（行内 css）
		return parseInt(obj.currentStyle[attr]);	// 兼容 IE
	}else{							// （行内和外部样式都能获取）
		return parseInt(getComputedStyle(obj,null)[attr]);	// 兼容其他 谷歌/火狐等
	}
}


/*********************************************************/




/*3.$封装函数，获取元素

 	目的：获取标签 $("div",obj)  $(".one",obj)  $("#one",obj) 
 		  创建标签 $("<div>") 
		  文档加载完成后执行 $(function(){})
		  

	思路：1.如果传入的selector是字符串
			判断是 class（获取） 、id（获取） 还是 标签（获取、创建）
		  2.如果传入的selector是函数，加载函数	

	
	str.replace("a","A")	把a替换成A
	str.charAt(下标);		查询下标
	str.slice(1);			截取下标为1（包括1）以后的值
*/
function $(selector,obj){
	obj=obj||document;
	if(typeof selector=="string"){	/
		selector=selector.replace(/^\s*|\s*$/,"");		// 删除selector里面两边上的空格，以避免干扰，$(" div")
		if(selector.charAt(0)=="."){					// 匹配 class
			return getClass(selector.substring(1),obj);
		}else if(selector.charAt(0)=="#"){				// 匹配 id
			return document.getElementById(selector.slice(1));
		}else if(/^[a-zA-Z][a-zA-Z1-6]{0,8}$/.test(selector)){	// 匹配 标签名
			return obj.getElementsByTagName(selector);
		}else if(/^<[a-zA-Z][a-zA-Z1-6]{0,8}>$/.test(selector)){	// 创建新标签
			selector=selector.slice(1,-1);						// 去掉 < >
			return document.createElement(selector);
		}
	}else if(typeof selector=="function"){
		window.onload=function(){
			selector();
		}
	}
}


/*****************************************************************************/

/* 4. 找到obj下面所有的子节点(元素节点 文本节点)
	最后得到一个集合
	type值   "no"：只获取元素节点     "yes"：获取元素节点，文本节点
*/
function getChilds(obj,type){
	var arr=[];
	var type=type||"no";
	var childs=obj.childNodes;
	for (var i = 0; i < childs.length; i++) {
		if (type=="no") {
		    if (childs[i].nodeType==1) {
			    arr.push(childs[i]);
			};
		}else if (type=="yes") {
			if (childs[i].nodeType==1||childs[i].nodeType==3&&childs[i].nodeValue.replace(/^\s*|\s*$/g,"")) {
				arr.push(childs[i]);
			}
		}
	}
	return arr;
}



/****************************************************/




/* 5.获取obj下面的第一个子节点(元素节点 文本节点)
	获取obj下的所有子节点getChild(obj,type)
	type值   "no"：只获取元素节点     "yes"：获取元素节点，文本节点
*/
function getFirst(obj,type){
	var type=type||"no";
	if (type=="no") {
		return getChilds(obj,"no")[0];
	}else if (type=="yes") {
		return getChilds(obj,"yes")[0];
	};
}


/****************************************************/




/* 6.获取obj下面的最后一个子节点(元素节点 文本节点)
	获取obj下的所有子节点getChild(obj,type)
	type值   "no"：只获取元素节点     "yes"：获取元素节点，文本节点
*/
function getLast(obj,type){
	var type=type||"no";
	if (type=="no") {
		return getChilds(obj,"no")[getChilds(obj,"no").length-1];
	}else if (type=="yes") {
		return getChilds(obj,"yes")[getChilds(obj,"yes").length-1];
	};
}



/****************************************************/

/*7.获取指定位置的子节点(元素节点 文本节点)
	获取obj下的所有子节点getChild(obj,type)
	type值   "no"：只获取元素节点     "yes"：获取元素节点，文本节点
	mum 第几个元素
*/
function getNum(obj,num,type){
	var type=type||"no";
	if (type=="no") {
		return getChilds(obj,"no")[num-1];
	}else if (type=="yes") {
		return getChilds(obj,"yes")[num-1];
	};
};


/****************************************************/

/*8.获取下一个兄弟节点
	获取obj下的所有子节点getChild(obj,type)
	type值   "no"：只获取元素节点     "yes"：获取元素节点，文本节点
*/
function getNext(obj,type){
	var type=type||"no";
	var next=obj.nextSibling;
	if (next==null) {
		return false;
	}
	if (type=="no") {
		while(next.nodeType==3||next.nodeType==8){
			next=next.nextSibling
			if (next==null) {
				return false;
			}
	    }
	}else if (type=="yes") {
		while(next.nodeType==3&&!next.nodeValue.replace(/^\s*|\s*$/g,"")||next.nodeType==8){
			next=next.nextSibling
			if (next==null) {
				return false;
			}
	    }
	}
	return next;
}

/****************************************************/

/*9.获取上一个兄弟节点
	获取obj下的所有子节点getChild(obj,type)
	type值   "no"：只获取元素节点     "yes"：获取元素节点，文本节点
*/
function getPrev(obj,type){
	var type=type||"no";
	var prev=obj.previousSibling;
	if (prev==null) {
		return false;
	}
	if (type=="no") {
		while(prev.nodeType==3||prev.nodeType==8){
			prev=prev.previousSibling
			if (prev==null) {
				return false;
			}
	    }
	}else if (type=="yes") {
		while(prev.nodeType==3&&!prev.nodeValue.replace(/^\s*|\s*$/g,"")||prev.nodeType==8){
			prev=prev.previousSibling
			if (prev==null) {
				return false;
			}
	    }
	}
	return prev;
}

/****************************************************/

/*10.将一个元素插入到另一个元素之后*/
function insertAfter(newobj,nowobj){
	var next=getNext(nowobj);
	var obj=nowobj.parentNode;
	if(next){
		return obj.insertBefore(newobj,next);
	}else{
		return obj.appendChild(newobj);
	}
}

/****************************************************/

/*11.将一个元素插入到另一个元素之前*/
function insertbefore(newobj,nowobj){
	var father=nowobj.parentNode;
	return father.insertBefore(newobj,nowobj);
}

/****************************************************/

// 12 事件添加
function addEvent(obj,event,fun){
	if(obj.addEventListener){
		//绑定在obj身上的是funEvent
		obj.addEventListener(event,funEvent,false);
	}else{
		//绑定在obj身上的是funEvent
		obj.attchEvent("on"+event,funEvent);
	}
	return funEvent;
	function funEvent(){
		//兼容事件对象
		var ev=e||window.event;
		//改变this指针，并且传递事件对象
		fun.call(obj,ev);
	}
}

/****************************************************/

/*13.删除事件兼容问题*/
function removeEvent(obj,event,fun){
	if(obj.addEventListener){
		//删除的事件应该是funEvent
		//也就是真正添加在obj身上的事件
		obj.removeEventListener(event,fun,false);
	}else{
		obj.detachEvent("on"+event,fun);
	}
}

/****************************************************/

/*14.滚轮事件兼容问题*/
function mousewheel(obj,upfun,downfun){
	if(obj.addEventListener){
		obj.addEventListener("mousewheel",scroll,false);
		obj.addEventListener("DOMMouseScroll",scroll,false);
	}else{
		obj.attachEvent("onmousewheel",scroll);
	}
	function scroll(e){
		var ev=e||window.event;
		if(ev.preventDefault){
			ev.preventDefault();
		}else{
			ev.returnValue=false;
		}
		var direction=ev.detail||ev.wheelDelta;
		if(direction==120||direction==-3){
			upfun.call(obj);
		}else if(direction==-120||direction==3){
			downfun.call(obj);
		}
	}
}

/***************************************************************/

//15.hover
//判断某个元素是否包含有另外一个元素
 function contains (parent,child) {
  if(parent.contains){
     return parent.contains(child) && parent!=child;
  }else{
    return (parent.compareDocumentPosition(child)===20);
  }
 }

//判断鼠标是否真正的从外部移入，或者是真正的移出到外部；
  function checkHover (e,target) {
   if(getEvent(e).type=="mouseover"){
      return !contains(target,getEvent(e).relatedTarget || getEvent(e).fromElement)&&
    !((getEvent(e).relatedTarget || getEvent(e).fromElement)===target)
   }else{
    return !contains(target,getEvent(e).relatedTarget || getEvent(e).toElement)&&
    !((getEvent(e).relatedTarget || getEvent(e).toElement)===target)
    }
  }
//鼠标移入移出事件
/*
  obj   要操作的对象
  overfun   鼠标移入需要处理的函数
  outfun     鼠标移除需要处理的函数
*/
function hover(obj,overfun,outfun) {
    if(overfun){
      obj.onmouseover=function  (e) {
        if(checkHover(e,obj)){
           overfun.call(obj,[e]);
        }
      }
    }
    if(outfun){
      obj.onmouseout=function  (e) {
        if(checkHover(e,obj)){
           outfun.call(obj,[e]);
        }
      }
    }
}
 function getEvent (e) {
      return e||window.event;
 }
