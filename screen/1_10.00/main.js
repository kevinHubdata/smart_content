/*<bloc1>*/
$('[path="1_10.00"] .fade1').velocity({
    opacity: 0
}, {
    duration: 1
});
var delay1 = setTimeout(function() {
    $('[path="1_10.00"] .fade1').velocity({
        opacity: 1
    }, {
        duration: 500,
        display: "block"
    });
}, 4600); /*</endBloc>*/ /*<bloc2>*/
	$('[path="1_10.00"] .fade2').velocity({
	    opacity: 0
	}, {
	    duration: 1
	});
$('[path="1_10.00"] .fade2').on('click',function(){

	EL.showAnimation(this);
	
	var delay2 = setTimeout(function() {

	    $('[path="1_10.00"] .fade2').velocity({
	        opacity: 1
	    }, {
	        duration: 300,
	        display: "block"
	    });
	}, 3200);

});


 /*</endBloc>*/ /*<bloc3>*/
$('[path="1_10.00"] .fade3').velocity({
    opacity: 0
}, {
    duration: 1
});
var delay3 = setTimeout(function() {
    $('[path="1_10.00"] .fade3').velocity({
        opacity: 1
    }, {
        duration: 300,
        display: "block"
    });
}, 4300); /*</endBloc>*/ /*<bloc4>*/
$('[path="1_10.00"] .fade4').velocity({
    opacity: 0
}, {
    duration: 1
});
var delay4 = setTimeout(function() {
    $('[path="1_10.00"] .fade4').velocity({
        opacity: 1
    }, {
        duration: 300,
        display: "block"
    });
}, 4150); /*</endBloc>*/ /*<bloc5>*/
$('[path="1_10.00"] .fade5').velocity({
    opacity: 0
}, {
    duration: 1
});
var delay5 = setTimeout(function() {
    $('[path="1_10.00"] .fade5').velocity({
        opacity: 1
    }, {
        duration: 300,
        display: "block"
    });
}, 4000); /*</endBloc>*/ /*<bloc6>*/
$('[path="1_10.00"] .fade6').velocity({
    opacity: 0
}, {
    duration: 1
});
var delay6 = setTimeout(function() {
    $('[path="1_10.00"] .fade6').velocity({
        opacity: 1
    }, {
        duration: 500,
        display: "block"
    });
}, 3500); /*</endBloc>*/ /*<bloc7>*/
$('[path="1_10.00"] .fade7').velocity({
    opacity: 0
}, {
    duration: 1
});
var delay7 = setTimeout(function() {
    $('[path="1_10.00"] .fade7').velocity({
        opacity: 1
    }, {
        duration: 3000,
        display: "block"
    });
}, 200); /*</endBloc>*/ /*<bloc8>*/
$('[path="1_10.00"] .trans8').velocity({
    translateX: -389
}, {
    duration: 1
});
var delay8 = setTimeout(function() {
    $('[path="1_10.00"] .trans8').velocity({
        translateX: 373.5
    }, {
        duration: 3000,
        easing: [.17, .67, .4, .92]
    });
}, 200); /*</endBloc>*/ /*<bloc9>*/
$('[path="1_10.00"] .fade9').velocity({
    opacity: 0
}, {
    duration: 1
});
var delay9 = setTimeout(function() {
    $('[path="1_10.00"] .fade9').velocity({
        opacity: 1
    }, {
        duration: 3000,
        display: "block"
    });
}, 200); /*</endBloc>*/