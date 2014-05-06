$(function() {
	window.seriecolor = {
		0: ["#D8D7DA", "#4DA3D5", "#1c638d"],
		1: ["#D8D7DA", "#bcbcbc", "#979797"],
		2: ["#4DA3D5", "#2b87bc", "#0c6ba3"],
	};

	if(loaddata){
		// window.loadId = [11,8,13];
		window.loadId = [11]; // single serie will load sub series(3rd level data)
		action(loadId, loaddata, 'onload');		
	} else {
		alert('Data not loaded!');
	}


	
});
