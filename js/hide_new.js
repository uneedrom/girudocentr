function toggleDropDown(id){
	var div=document.getElementById(id);
	if(div.className=="slide-show"){
		div.className="slide-hide";
	}else{
		div.className="slide-show";
	}
	return (false);
}

function hide(id){
	return (toggleDropDown(id));
}
