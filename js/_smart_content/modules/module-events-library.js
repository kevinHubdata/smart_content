
var events_library = {
    
    popup: {
        id: null,
        name: null,
        start: null
    },
    ref: {
        start: null,
    },
    p_index: null,
    q_index: null,
    template:{
        popup: '<div id="sm_popup" class="sm_popup_overlay"><div class="sm_popup"><h2>{title}</h2><a class="sm_popup_close" href="#" onclick="this.closest(\'#sm_popup\').remove();">&times;</a><div class="sm_popup_content">{content}</div></div></div>'
    },
    __construct: function(){

        this.header_postcall_event();
        this.triggers();
        this.capacityLocalStorage();
        this.p_index = window.parent.getCurrentPresentation();
        this.q_index = window.parent.getCurrentSequence();

        if(this.p_index == null || this.q_index == null){
            SC.logs.push({"Library index error":"Not found"});
        }


    },
    header_postcall_event: function(){

        try{
            var postcall = parent.document.querySelector('#postcallButton'),
                self = this;

            if(postcall){

                postcall.removeAttribute('onclick');
                postcall.style.backgroundColor = "#11a8ab";
                postcall.style.background = "#11a8ab";
                postcall.style.backgroundImage = "none";
                postcall.addEventListener('click',function(event){

                        event.stopPropagation();
                        event.preventDefault();

                        if(window.parent.context.customers.length > 0)
                            MENU.handle_event.show.ncp();
                        else
                            self.show_popup('Attention' , 'Please select a physician to perform a call.');
                        
                        return false;

                }, false);

            }else{

                setTimeout(function(){
                    self.header_postcall_event()
                },200);

            }

        }catch(e){
            SC.logs.push({'Error Mi event':'Postcall button error'});
        }
    },
    triggers: function(){

        var self = this;

       // if preview zone is ready
       try{

           var previewZone = parent.document.querySelector('#previewplay');

           if(!previewZone){
                 this.triggers();
                 return false;
            }

       }catch(e){
            SC.logs.push({"Error Mi previewplay":"previewplay button"});
       }


         try{
                // default preview button
                var previewBtn = parent.document.querySelector('.previewbutton');

                previewBtn.addEventListener('click', function(){

                    // If mode preview disable postcall action
                    var postcall_btn = document.querySelector('#menu__btn_postcall');
                        postcall_btn.style.opacity = 0.5;
                        postcall_btn.removeAttribute("onclick");

                    self.getLocalStorage(function(arr_presentation){

                        // Set preview in obj call
                        arr_presentation[0]["call"]['crm_mv_is_preview'] = true;

                        // write localStorage
                        self.writeLocalStorage(arr_presentation);
                    });

                },false);
              
          }catch(e){
                SC.logs.push({"Error Mi event":"preview button"});
          }

       try{

            // default play button
            var playBtn = parent.document.querySelector('#playbutton');

            playBtn.addEventListener('click', function(){
                self.play();
            },false);
     
       }catch(e){
            SC.logs.push({"Error Mi event":"play button"});
       }

      try{
            // default cancel button
            var closeBtn = parent.document.querySelector('#closebutton');

            closeBtn.addEventListener('click', function(){
                    self.cancel_action();
            },false);

      }catch(e){
             SC.logs.push({"Error Mi event":"close button"});
      }

      try{
             window.parent.bind(this,'memoryWarning', function(){

                   DEVICE.set_cache_memory_warning(Date.now());
            });      

      }catch(e){
            SC.logs.push({"Error Mi Events":"memoryWarning"});
      }

      try{

            var delete_popup = parent.document.querySelector('#cancel_content');

            delete_popup.addEventListener('click', function(){
                self.cancel_action();

            },false);

      }catch(e){
          SC.logs.push({"Events":"Popup delete (cancel)"});
      }
      
    },
    play: function(){

        var self = this;

        this.getLocalStorage(function(arr_presentation){

            var lgth = arr_presentation[arr_presentation.length-1]["sequence"]["screen"].length;

            // Remove startime to current
            arr_presentation[arr_presentation.length-1]["sequence"]["screen"][lgth-1]['crm_mv_start'] = Date.now();

            // write localStorage
            self.writeLocalStorage(arr_presentation);
        });

    },
    feedback: function(_this){

        var feedback_value = _this.getAttribute('feedback');

        var self = this;

        if(feedback_value == "right" || feedback_value == "left"){

            feedback_value = feedback_value == "right" ? "Positive" : "Negative";

            self.getLocalStorage(function(arr_presentation){

                var lgth = arr_presentation[arr_presentation.length-1]["sequence"]["screen"].length;

                // Remove startime to current
                arr_presentation[arr_presentation.length-1]["sequence"]["screen"][lgth-1]['sm_feedback'] = feedback_value;

                // write localStorage
                self.writeLocalStorage(arr_presentation);
            });       
        }

    },
    postcall: function(){

        if(window.parent.context.customers.length > 0){

            this.postcall_action(); 

        }else{
            this.show_popup('Attention' , 'Please select a physician to perform a post call.');
        }

    },
    show_popup: function(title,content){

            var tmp_popup = this.template.popup;

                _popup_html = tmp_popup.replace('{title}',title);
                _popup_html = _popup_html.replace('{content}',content);

                document.body.insertAdjacentHTML('beforeend', _popup_html);
    },
    cancel : function(){

        this.cancel_action();
    },
    cancel_action: function(){

        this.capacityLocalStorage();

        var self = this;

        this.getLocalStorage(function(arr_presentation){

            // Bind HCP to call object
            HCP.__construct(function(){
                  arr_presentation[0].hcp = window.call.hcp;
            });

            // Add infos close to call object
            arr_presentation[0]["call"]["crm_mv_closedType"] = "cancel";
            arr_presentation[0]["call"]["date"]["dev_end_date"] = Date.now();

            // Add logs
            arr_presentation[arr_presentation.length-1].logs = SC.logs;

            // Add feedback
            var feedback = window.parent.context.presentations[self.p_index].sequences[self.q_index].feedback;
            if(feedback){
                arr_presentation[arr_presentation.length-1]["sequence"]["crm_mv_screen_feedback"] = feedback;
            }

            // Write local storage
            self.writeLocalStorage(arr_presentation);
            self.send_dashboard(function(){
                window.parent.onCancel();
            }); 
        });

    },
    postcall_action: function(){

        this.capacityLocalStorage();

        var self = this,
            ncp  = document.querySelector('#sm_ncp');

        this.getLocalStorage(function(arr_presentation){

            // Bind HCP to call object
            HCP.__construct(function(){
                  arr_presentation[0].hcp = window.call.hcp;
            });

            // Add infos close to call object
            arr_presentation[0]["call"]["crm_mv_closedType"] = "postcall";
            arr_presentation[0]["call"]["date"]["dev_end_date"] = Date.now();

            // Add logs
            arr_presentation[arr_presentation.length-1].logs = SC.logs;

            // Add feedback
            var feedback = window.parent.context.presentations[self.p_index].sequences[self.q_index].feedback;

            if(feedback){
                arr_presentation[arr_presentation.length-1]["sequence"]["crm_mv_seq_feedback"] = feedback;
            }

            // Write local storage
            self.writeLocalStorage(arr_presentation);
            
            // Send data to server
            self.send_dashboard(function(){
                window.parent.postcall();
            });
        });

    },
    send_dashboard: function(callback){

           var data_ = JSON.parse(localStorage.getItem(SC.UID));

           var allData = {};
               allData.data = data_;

          $.ajax({
            method: "POST",
            url: "http://sm.flowmaker.io/smdata.php",
            data: allData
          }).done(function( msg ) {
                callback();
          });

    },
    capacityLocalStorage: function(){

        var total = (1024 * 1024 * 5 - unescape(encodeURIComponent(JSON.stringify(localStorage))).length);

        if( total < 1000000){
            alert('Local storage warning capacity');
        }
    },
    openPopup: function(name,id){

        if(name && id){
            this.popup.name = name;
            this.popup.id = id;
            this.popup.start = Date.now();
        }else{
            SC.logs.push({"Popup attr/id": id+" Not found"});
        }

    },
    showAnimation: function(_this_){

        var self = this;

        var obj =  {
                     "fm_name": null,
                     "sm_duration": null, 
                     "sm_trigger": null
                    }

        try{obj.fm_name = _this_.getAttribute('fm-animation-name')}
        catch(e){ SC.logs.push({"Animation fm_name can not be recovered":e}); }

        try{obj.sm_duration = _this_.getAttribute('fm-animation-duration')}
        catch(e){ SC.logs.push({"Animation sm_duration can not be recovered":e}); }

        try{obj.sm_trigger = _this_.getAttribute('fm-animation-trigger')}
        catch(e){ SC.logs.push({"Animation sm_trigger can not be recovered":e}); }


        if(obj.fm_name && obj.sm_duration){

            this.getLocalStorage(function(arr_presentation){

                    var presLgh = arr_presentation.length-1,
                        srcLgh  = arr_presentation[presLgh].sequence.screen.length-1;

                    arr_presentation[presLgh].sequence.screen[srcLgh].sm_animation.push(obj);

                    self.writeLocalStorage(arr_presentation);
            })
        }

    },
    closePopup: function(){

        var self = this;

        if(this.popup.name){

            this.getLocalStorage(function(arr_presentation){

                    var presLgh = arr_presentation.length-1,
                        srcLgh  = arr_presentation[presLgh].sequence.screen.length-1;

                    var data_popup = {

                        "fm_name" : self.popup.name,
                        "sm_duration" : Date.now() - self.popup.start
                    } 

                    arr_presentation[presLgh].sequence.screen[srcLgh].sm_popup.push(data_popup);

                    self.writeLocalStorage(arr_presentation);
            })

            // remove data opened popup
            self.popup.name = null;
            self.popup.start = null;

        }
    },
    refOpen: function(){
        this.ref.start = Date.now();
    },
    pdfOpen: function(){

            var self = this;

            this.getLocalStorage(function(arr_presentation){

                    var presLgh = arr_presentation.length-1,
                        srcLgh  = arr_presentation[presLgh].sequence.screen.length-1;

                    arr_presentation[presLgh].sequence.screen[srcLgh].sm_pdf = "true";

                    self.writeLocalStorage(arr_presentation);
            });       
    },
    refClose: function(){

        if(this.ref.start){

            var self = this,
                duration = (Date.now() - this.ref.start);

            this.getLocalStorage(function(arr_presentation){

                    var presLgh = arr_presentation.length-1,
                        srcLgh  = arr_presentation[presLgh].sequence.screen.length-1;

                    var data_ref = {
                        "sm_duration" : duration
                    } 

                    arr_presentation[presLgh].sequence.screen[srcLgh].sm_reference.push(data_ref);

                    self.writeLocalStorage(arr_presentation);

                    self.ref.start = null;
            })

        }
    },
    /*
        1 - Create new entry screen in presentation
     */
    changeScreen: function(screen){

           var self = this;

           if(Object.prototype.toString.call( ARGO.options.flow[screen + 1] ) === '[object Object]'){

                try{ var fm_id = ARGO.options.flow[screen +1].flowmaker_id }catch(e){ SC.logs.push({"Flows json error":"flowmaker_id"}) }
                try{ var fm_page_id = ARGO.options.flow[screen +1].page_id }catch(e){ SC.logs.push({"Flows json error ":"page_id"}) }

           }else{
                SC.logs.push({"Screen unknow":"Can not be loaded"});
           }

          this.getLocalStorage(function(arr_presentation){

                if( Object.prototype.toString.call( arr_presentation ) === '[object Array]' ) {

                      arr_presentation[arr_presentation.length -1].sequence.screen.push({
                            "fm_screen_id": typeof fm_id != "undefined" ? fm_id : null,
                            "crm_mv_name":  typeof fm_page_id != "undefined" ? fm_page_id : null,
                            "crm_mv_start": Date.now(),
                            "crm_m_keymessage_category": null,
                            "sm_popup": [],
                            "sm_pdf": [],
                            "sm_reference": [],
                            "sm_video": [],
                            "sm_tap_animation": [],
                            "sm_feedback": "neutral",
                            "sm_animation": []
                      });

                      self.writeLocalStorage(arr_presentation);

                }else{

                      SC.logs({"Local storage presentation":"Wrong format"});
                }

          });
    },
    getLocalStorage: function(callback){

        var arr_presentation = JSON.parse(localStorage.getItem(SC.UID));

        if(arr_presentation) return callback(arr_presentation)
        else SC.logs.push({"Locale storage UID error":"Not found"});
    },
    writeLocalStorage: function(arr_presentation){
        localStorage.setItem(SC.UID, JSON.stringify(arr_presentation));
    }
}

EL = Object.create(events_library);
EL.__construct();