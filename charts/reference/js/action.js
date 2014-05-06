$(function() {


	// loaddata = $.parseJSON(loaddata);

	// Load Page

	var close = '<span class="closebtn">X</span>';
	var cflag;
	var el = $(".input");
// if(el.length >=3 ){}
    
    el.focus(function(e) {
        if (e.target.value == e.target.defaultValue){
        	e.target.value = '';
    	}
    });
    el.blur(function(e) {
        if (e.target.value == ''){
            e.target.value = e.target.defaultValue;
        }
    });

	
});
