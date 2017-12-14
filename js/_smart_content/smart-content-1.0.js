/*

    SMARTCONTENT v1.0 ~ 2017-05-31 ~ Copyright (c) 2017 HubData, http://www.hubdata.fr/
	@author: kevin bouret
 */
var smartContent = {
	mode: "dev",
	logs: [],
	UID: null,
    data_flowmaker: null,
	urls: {
		parameters: "js/_smart_content/parameters/parameters.json",
		dataModel: "js/_smart_content/data_model/data-model.json",
        questions: "js/_smart_content/parameters/questions.json",
		modules: {
			call: "js/_smart_content/modules/module-call.js",
			reps: "js/_smart_content/modules/module-reps.js",
			hcp: "js/_smart_content/modules/module-hcp.js",
			device: "js/_smart_content/modules/module-device.js",
			sequence: "js/_smart_content/modules/module-sequence.js",
			presentation: "js/_smart_content/modules/module-presentation.js",
			eventsLib: "js/_smart_content/modules/module-events-library.js",
            menu: "js/_smart_content/modules/module-menu.js",
            lcr: "js/_smart_content/modules/module-lcr.js",
            app: "js/framework/app.js"
		}
    },
	__construct: function() {

        this.polyfill();

		// GET DATA MODEL
        window.data = {}; 
        window.call = {};
		this.get_fm_parameters();
        //this.get_fm_questions();
	},
	/**
     * Get the data writed by flowmaker.
     * @ load : parameters.json
     */
	get_fm_parameters: function() {
		var self = this;
        try{
            this.ajax(
                self.urls.parameters,
                function(result) {
                    self.push_parameters(JSON.parse(result));
                },
                "parameters.json c'ant be loaded",
                "JSON"
            );
        }catch(e){
            alert(e)
        }
	},
    get_fm_questions: function() {
        var self = this;
        try{
            this.ajax(
                self.urls.questions,
                function(result) {
                    self.questions = JSON.parse(result);
                },
                "questions.json c'ant be loaded",
                "JSON"
            );
        }catch(e){
           alert(e);
        }
    },
	/**
     * Populate global data object with data of flowmaker.
     * @ use data : parameters.json
     */
	push_parameters: function(parameters) {

         this.data_flowmaker = parameters;
         //window.data.fm_presentation_info = parameters;

		// IF FLOWMAKER ID EXIST
		if (this.data_flowmaker[0].project.presentation.fm_presentation_id != null) this.startAllProcess();
	},
	startAllProcess: function() {

        var self = this;

        try{
            
            if(window.parent.context.presentationsOrderSeen < 2){
                self.begin_call_module();
            }

            this.helper.loadJs(this.urls.modules.hcp, function() {
                console.log('HCP instancied')
            });

            this.helper.loadJs(this.urls.modules.lcr, function() {
                console.log('LCR instancied')
            });

            this.helper.loadJs(this.urls.modules.reps, function() {
                console.log('REPS instancied')
            });

            this.helper.loadJs(this.urls.modules.sequence, function() {
                console.log('SEQUENCE instancied')
            });

            this.helper.loadJs(this.urls.modules.presentation, function() {
                console.log('PRESENTATION instancied')
            });

            this.helper.loadJs(this.urls.modules.menu, function() {
                MENU.__construct();
            });

            this.helper.loadJs( this.urls.modules.eventsLib , function(){
                console.log('EL instancied')
                self.check_instance_object();
            });

        }catch(e){
            alert(e);
        }
	},
    begin_call_module: function(){

        this.helper.loadJs(this.urls.modules.call, function() {
            console.log('call instancied')
        });

        this.helper.loadJs(this.urls.modules.device, function() {
            console.log('DEVICE instancied')
        });

    },
    check_instance_object: function(){

        var self = this,
            object;

        if(window.parent.context.presentationsOrderSeen < 2)
            object = [typeof CALL,typeof REPS,typeof HCP,typeof LCR, typeof DEVICE,typeof SEQUENCE,typeof PRESENTATION,typeof EL];
        else
            object = [typeof SEQUENCE,typeof PRESENTATION,typeof EL,typeof REPS];

        if(object.indexOf('undefined') == -1){

             self.init_localStorage(function(){
                self.helper.loadJs( self.urls.modules.app , function(){});
             });

       }else{

          SC.logs.push({"Object not instancied":"Wait to start module app"});

          setTimeout(function(){
                self.check_instance_object();
          },100);
       }
    },
	/**
     *  Check if inside CALL ( presentationsOrderSeen < 2).
     *  Check if localStorage exist
     *  If new CALL push new CALL_ID in localStorage
     *  @ localStorage : ("CALL_ID",["id","id"])
     *  @ localStorage : ("ID", [{presentation},{presentation}])
     */
	init_localStorage: function(callback){

        var self = this;

        /** 
         *  Check if first presentation in call
         *  If value == 0 or 1 so it's first
         */
        if(window.parent.context.presentationsOrderSeen < 2){

            try{

                self.call.create(self,function(){
                    callback();
                });

            }catch(e){
                self.logs.push({ "LocalStorage begin call error": e });
            }


        }else{
            /**
             *  If it's not first presentation.
             *  Get last CALL_ID. Last call id is the current call id.
             *  Add presentation to current call.
             */
        	try{

                self.call.add(self,function(){
                    callback();
                });

            }catch(e){

                self.logs.push({ "LocalStorage push presentation": e });
            }

        }
    },
    call:{
        create: function(self,callback){

            // Create uniq id
            self.UID = self.helper.UID();

            console.log("UID : "+self.UID);

            if(localStorage.getItem("CALL_ID") == null){

                localStorage.setItem("CALL_ID",JSON.stringify([self.UID]));
            }

            // GET ALL CALL_ID
            var CALL_ID = JSON.parse(localStorage.getItem("CALL_ID"));

            // PUSH NEW CALL_ID
            CALL_ID.push(self.UID);

            // SET CALL_ID
            localStorage.setItem("CALL_ID",JSON.stringify(CALL_ID));   

            // ADD UID TO OBJECT CALL AND DATA
            window.call.call.sm_callid = self.UID;
            window.data.callid = self.UID;

            // ADD LOG
            window.data.logs = self.logs;

            // Add presentation in local storage
            localStorage.setItem(self.UID , JSON.stringify([window.call , window.data]));

            callback();
        },
        add: function(self,callback){

                object = [typeof CALL,typeof REPS,typeof HCP,typeof DEVICE];

                // GET LAST CALL_ID
                var arr_call_id = JSON.parse(localStorage.getItem("CALL_ID"));
                    self.UID = arr_call_id[arr_call_id.length-1];

                // GET LAST CALL
                var PRESENTATION = JSON.parse(localStorage.getItem(self.UID));

                // IF LAST CALL HAVE CLOSEDTYPE (cancel or postcall)
                // SO IT'S NEW CALL
                if(PRESENTATION[0]["call"]["crm_mv_closedType"] != null){

                        try{

                            if(object.indexOf('undefined') == 0){
                                setTimeout(function(){
                                    self.begin_call_module();
                                    self.call.add(self,function(){
                                        callback();
                                    });   
                                },100);
                            }else{
                                self.call.create(self,function(){
                                        callback();
                                });      
                            }

                        }catch(e){
                            self.logs.push({ "LocalStorage begin call error": e });
                        }
                }else{

                    // ADD UID
                    window.data.callid = self.UID;

                    // ADD LOG
                    window.data.logs = self.logs;

                    // PUSH NEW PRESENTATION IN LAST CALL
                    PRESENTATION.push(window.data);

                    // SET LAST CALL
                    localStorage.setItem(self.UID, JSON.stringify(PRESENTATION));

                    callback();
                }
        }
    },
	helper: {

		loadJs: function(url, callback) {
			var jsfile = document.createElement("script");
			jsfile.src = url;
			jsfile.onload = function() {
				callback();
			};

            head = document.getElementsByTagName('head')[0]
            head.appendChild(jsfile);

		},
		UID: function(){

				function s4() {
				return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
				}
				return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				s4() + '-' + s4() + s4() + s4();
        }
	},
	ajax: function(url, callback) {

        var self = this;
        
         function makeRequest(url,callback) {

            var httpRequest = false;

            httpRequest = new XMLHttpRequest();

            if (!httpRequest) {
                alert('Abandon :( Impossible de créer une instance XMLHTTP');
                return false;
            }

            httpRequest.onreadystatechange = function() { alertContents(httpRequest,callback); };
            httpRequest.open('GET', url, true);
            httpRequest.send(null);
        }
        makeRequest(url,callback);

        function alertContents(httpRequest,callback) {

           // try {
                if (httpRequest.readyState == 4) {
                    if (httpRequest.status == 200 || httpRequest.status == 0) {
                        callback(httpRequest.responseText)
                    } else {

                        alert("Un problème est survenu au cours de la requête.");

                    }
                }
            /*}
            catch( e ) {
                alert("Une exception s’est produite : " + e); 
            }*/

        }
	},
	console: function(text) {

		console.log(text);
	},
    polyfill: function(){

        if (window.Element && !Element.prototype.closest) {
                Element.prototype.closest = 
                  function(s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                        i,
                        el = this;
                    do {
                      i = matches.length;
                      while (--i >= 0 && matches.item(i) !== el) {};
                    } while ((i < 0) && (el = el.parentElement)); 
                    return el;
                  };
        }
    }
};

SC = Object.create(smartContent);
SC.__construct();