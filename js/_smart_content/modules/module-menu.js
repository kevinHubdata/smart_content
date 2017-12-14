var module_menu = {

    ressources:{

        template:{
            lcr: 'js/_smart_content/tmpl/lcr.html',
            ncp: 'js/_smart_content/tmpl/ncp.html',
            menu: 'js/_smart_content/tmpl/menu.html',
            km: 'js/_smart_content/tmpl/km.html',
            ltd: 'js/_smart_content/tmpl/ltd.html'
        },
        css:{
            main: "js/_smart_content/css/smart-content.css",
            slider: "js/_smart_content/css/plugins/slider.css"
        },
        json:{
            questions: "js/_smart_content/parameters/questions.json"
        }
    },
    ID: null,
    getLcr: null,
    firstShow: true,
    noneClmProducts: [],
    recomandations: {},
    options: {year: "numeric", month: "long", day: "numeric"},
    matrice_speciality: {
        "04AO" : "cardiology",
        "0471" : "general_practice"
    },
    __construct: function(){


        // Get local storage
        this.getLcr();

        // Insert css
        this.insert_css();

        // Get UID customer
        if(window.parent.context.customers.length > 0)
            this.ID = window.parent.context.customers[0].onekeyid;

        // Start task
        this.init();


        // change customer
        this.changeCustomer();

    },
    init: function(display_lcr,display_ncp){

        var stage_   = document.querySelector('#stage'),
            self     = this;

            if(!stage_){

                setTimeout(function(){
                    self.init(display_lcr,display_ncp);
                },200);

            }else{

                var feedback_left = document.createElement("div");
                    feedback_left.setAttribute("id","feedbackleft");
                    feedback_left.setAttribute("feedback","left");
                    feedback_left.setAttribute("onclick","EL.feedback(this)");

                var feedback_right = document.createElement("div");
                    feedback_right.setAttribute("id","feedbackright");
                    feedback_right.setAttribute("feedback","right");
                    feedback_right.setAttribute("onclick","EL.feedback(this)");

                // Create button burger
                var btn_burger = document.createElement("div");
                    btn_burger.setAttribute("id","burger");

                document.body.appendChild(btn_burger);

                stage_.appendChild(feedback_left);
                stage_.appendChild(feedback_right);

                // add eventListener to button burger
                self.handle_event.burger(btn_burger,self);

                // if customer selected && have existing call
                if(window.parent.context.customers.length > 0
                   && self.lcr.hasOwnProperty(window.parent.context.customers[0].onekeyid)){

                        self.create("display_lcr");
                }else{
                        self.create(null);
                }
            }
    },
    create: function(display_lcr,display_ncp){

        if(window.parent.context.customers.length > 0)
            this.ID = window.parent.context.customers[0].onekeyid;

        this.insert_html();
        this.firstShow = false;
        this.display_html(display_lcr);
    },
    getLcr: function(){

        if(localStorage.getItem('HCP') != null){
            this.lcr = JSON.parse(localStorage.getItem('HCP'));    
        }else{
            localStorage.getItem('HCP',JSON.stringify({}));
            this.lcr = {};
        }
        
    },
    /*
        If change customer while presentation
     */
    changeCustomer: function(){

        var self = this;

        setInterval(function(){

            if(window.parent.context.customers.length > 0){

                if(self.ID != window.parent.context.customers[0].onekeyid){
                
                    self.ID = window.parent.context.customers[0].onekeyid;

                    var menu   = document.querySelector('#sm_menu'),
                        lcr    = document.querySelector('#sm_lcr'),
                        ncp    = document.querySelector('#sm_ncp'),
                        burger = document.querySelector('#burger'),
                        stage  = document.querySelector('#stage');

                        stage.classList.remove('show');

                        if(menu) menu.remove();
                        if(lcr) lcr.remove();
                        if(ncp) ncp.remove();
                        if(burger) burger.remove();

                        self.firstShow = true;

                        self.init();
                }

            }

        },1000);

    },
    /*
        Insert all css
     */
    insert_css: function(){

        var mainCss = document.createElement("link");
            mainCss.setAttribute("rel","stylesheet");
            mainCss.setAttribute("type","text/css");
            mainCss.href = this.ressources.css.main;

        head = document.getElementsByTagName('head')[0];
        head.appendChild(mainCss);

        var sliderCss = document.createElement("link");
            sliderCss.setAttribute("rel","stylesheet");
            sliderCss.setAttribute("type","text/css");
            sliderCss.href = this.ressources.css.slider;

        head = document.getElementsByTagName('head')[0];
        head.appendChild(sliderCss);
    },
    /*
        Insert all template html
     */
    insert_html: function(){

        var self = this;

        try{
            self.template_menu();
            self.template_lcr();
            self.template_ncp();
            self.template_ltd();
            self.template_know_more();

         }catch(e){
              SC.logs.push({'Template html can not be loaded':e});
         }
    },
    /*
        Get template lcr
        @ template : js/_smart_content/tmpl/lcr.html
     */
    template_lcr: function(){

        var self = this;

        SC.ajax(self.ressources.template.lcr, function(tmpl){

            self.getHeaderInfos(function(output){

                output = output.replace( '{presentation}' , self.getSeenPresentation());
                output = output.replace( '{recomanded}' , self.getRecomandedPresentation());

                document.body.insertAdjacentHTML('beforeend', output);

            },tmpl);

        });
    },
    /*
        Get template menu
        @ template : js/_smart_content/tmpl/menu.html
     */
    template_menu: function(){

        var self = this;

        SC.ajax(self.ressources.template.menu, function(tmpl){

            self.getHeaderInfos(function(output){
                document.body.insertAdjacentHTML('beforeend', output);    
            },tmpl);
            
        });
    },
    /*
        Get template next call preparation
        @ template : js/_smart_content/tmpl/ncp.js
     */
    template_ncp: function(){

        var self = this;

        SC.ajax(self.ressources.template.ncp, function(tmpl){

            self.getQuestions(function(html_questions){

                   tmpl = tmpl.replace('{questions}', html_questions);
                   tmpl = tmpl.replace('{discussed_today}', self.getDiscussedToday());
                   tmpl = tmpl.replace('{other_products}', self.getNoneClmProducts());
                   tmpl = tmpl.replace('{recommandations}', self.getRecommandations());

                   // None clm presentation

                   self.getHeaderInfos(function(output){

                        document.body.insertAdjacentHTML('beforeend', output);

                   },tmpl);
            });

        });
    },
    template_ltd: function(){

        var self = this;

        SC.ajax(self.ressources.template.ltd, function(tmpl){

            document.body.insertAdjacentHTML('beforeend', tmpl);

        });
    },
    template_know_more: function(){

        var self = this;

        SC.ajax(self.ressources.template.km, function(tmpl){

               self.getKnowMore(tmpl,function(output){

                    document.body.insertAdjacentHTML('beforeend', output);
               });
        });

    },
    getKnowMore: function(tmpl,callback){

       try{
            var self      = this,
                hcpInfos  = { sm_lcr_mail: "",sm_lcr_phone:""},
                question_tmpl = "<hr><h3>{name}</h3><p>{answer}</p>",
                question_html = "",
                call_tmpl     = "<p>Date: {date}</p><p>By: {by}</p><p><span>Name: {presentation}</span></p><p>Comments: {comments}</p><hr>",
                call_html     = "";

           // If there is a recorded call 
           if(self.lcr.hasOwnProperty(self.ID)){

                var _infos_  = self.lcr[self.ID].infos,
                    _call_   = self.lcr[self.ID].call;

                hcpInfos.sm_lcr_mail = _infos_.hasOwnProperty('sm_lcr_mail') ? _infos_.sm_lcr_mail : "";
                hcpInfos.sm_lcr_phone = _infos_.hasOwnProperty('sm_lcr_phone') ? _infos_.sm_lcr_phone : "";

                /* 
                    Recovers all the questions that the hcp responded to accros all call
                    @ SC.questions
                */
                if(SC.questions && typeof SC.questions == "object"){

                    var answered = {};

                    // Recover all questions in call object
                    for(var e in _call_){

                        var _questions_ = _call_[e].questions;

                        for(var id in _questions_){ answered[id] = _questions_[id]}

                    }

                    /*
                        If answered object contains questions/answer
                        Build template question
                     */
                    if(Object.keys(answered).length > 0){

                        for(var a in answered){

                            var template = question_tmpl; 
                                template = template.replace('{name}',SC.questions[a].question);   
                                template = template.replace('{answer}',answered[a]);

                                question_html += template;
                        }

                    }

                }

                /*
                    Retrieve information from all calls
                 */
                for(var e in _call_){

                        var calldate = new Date(_call_[e].calldate);
                        var template = call_tmpl;
                            template = template.replace("{date}", calldate.toLocaleDateString("en-US",self.options));
                            template = template.replace("{by}",_call_[e].reps.firstname+" "+_call_[e].reps.lastname);
                            presentation_name = "";

                        for(var i in _call_[e].presentations){
                            presentation_name += "<span>"+_call_[e].presentations[i].name+"</span>";
                        }

                        template = template.replace("{presentation}",presentation_name);
                        template = template.replace("{comments}",_call_[e].comments != null ? _call_[e].comments : "");

                        call_html += template;
                }
           }

           hcpInfos.sm_lcr_mail = hcpInfos.sm_lcr_mail.length > 0 ? hcpInfos.sm_lcr_mail : window.parent.context.customers[0].email;

           tmpl = tmpl.replace('{mail}',hcpInfos.sm_lcr_mail);
           tmpl = tmpl.replace('{phone}',hcpInfos.sm_lcr_phone);
           tmpl = tmpl.replace('{calls}',call_html);
           tmpl = tmpl.replace('{questionsAnswered}',question_html);

           callback(tmpl);

        }catch(e){
            console.log(e);
        }

    },
    /*
        List of possible recommendations
        The data comes from the flowmaker
        @ : js/_smart_content/parameters/parameters.json
     */
    getRecommandations: function(){

        var html = "",
            talkabout = "<div id='talkingabout'>"+
                             "<div class='close'></div>"+
                             "<span talk='true' onclick='MENU.handle_event.ncp.talk(this)'>"+
                                "Talk about it"+
                                "<span class='category' onclick='MENU.handle_event.ncp.category(event,this)'></span>"+
                             "</span>"+
                             "<span talk='false' onclick='MENU.handle_event.ncp.donttalk(this)'>Don't talk about it</span>"+
                             "<div class='listcategory'>"+
                                "<div class='close' onclick='MENU.handle_event.ncp.close(event,this)'></div>"+
                                "<h5>Choose your focus</h5>"+
                                    "<div class='boxList'>"+
                                         "{listcategory}"+
                                    "</div>"+
                             "</div>"+
                        "</div>";

        if(SC.data_flowmaker.hasOwnProperty('fm_content_recommandations')){

            for(var e in SC.data_flowmaker.fm_content_recommandations){

                var category = SC.data_flowmaker.fm_content_recommandations[e].category;

                        var tmp_category = "";

                        for(var i in category){
                            var name = category[i];
                            tmp_category += "<span onclick='MENU.handle_event.ncp.listcategory(event,this)' category='"+name+"'>"+name+"</span>";
                        }

                        html += "<span name='"+e+"'>"+e+talkabout+"</span>";
                        html = html.replace('{listcategory}', tmp_category);
            }

        }else{
            return "<p>They are no recommandations</p>";
        }

        return html;

    },
    /*
        Get all presentation names from localStorage
     */
    getDiscussedToday: function(){

        var current_call = localStorage.getItem(SC.UID),
            html         = "";

        if(current_call){

            current_call  = JSON.parse(current_call);

            for(var e in current_call){

                if(e != 0){

                    html += "<div><span>"+current_call[e].presentation.crm_mv_name+"</span></div>";
                }
            }

            return html;

        }else{

            return '<p>Unable to retrieve current call</p>';
        }
    },
    /*
        Get all none clm products
        @ json : js/_smart_content/parameters/parameters.json
     */
    getNoneClmProducts: function(){

        var html = "";

        if(SC.hasOwnProperty('data_flowmaker')){

            for(var i in SC.data_flowmaker.fm_none_clm_produts){

                var name = SC.data_flowmaker.fm_none_clm_produts[i];

                html += "<span name='"+name+"'>"+name+"</span>";
            }

            return html;
        }

        return "<p>No other products clm</p>";
    },
    /*
       Get questions from flowmaker
       Display questions
       @ json: parameters/questions.json
     */
    getQuestions: function(callback){

        var self = this;

        try{ SC.questions = SC.data_flowmaker[0].project.last_call_report.questions_list; }
        catch(e){ SC.logs.push({"Questions can not be loaded": e}) }

        if(SC.questions && typeof SC.questions == "object"){

            typeof SC.questions == "object" ? "" : SC.logs.push({"Questions object error":"Not exist"});
            Object.keys(SC.questions).length > 1 ? "" : SC.logs.push({"Questions object error":"No records"});

            var question_html  = "<!-- questions list -->",
                incr           = 1;

            // Quantity maximum of question displayed
            maxQuestionFm  = SC.data_flowmaker[0].project.last_call_report.general_settings.survery_per_call_quantity;
            var maxQuestion = maxQuestionFm && maxQuestionFm != null ? maxQuestionFm : 4;

            // Array containing the lcr questions id
            var questionsLcr = [];

            // If table HCP in localstorage contains self.ID
            // @argument self.ID : uniq id of HCP
            if(self.lcr.hasOwnProperty(self.ID)){

                for(var e in self.lcr[self.ID].call){

                    for(var i in self.lcr[self.ID].call[e].questions){

                            if(questionsLcr.indexOf(i) == -1){

                                questionsLcr.push(i);
                            }
                    }

                }
            }
            
            question_html += '<div class="row">'+SC.questions["Q00"]["html"];

            // all questions
            var arr_questions =[],
                place = 1;

            for(var e in SC.questions){

                if(questionsLcr.indexOf(i) == -1 && incr < maxQuestion && i != "Q00"){

                        if(place == 1) place = 2;
                }
            }

            try{

                for (var i in SC.questions){

                    if(questionsLcr.indexOf(i) == -1 && incr < maxQuestion && i != "Q00"){

                            if((incr % 2) != 1){
                            
                                question_html += '<div class="row">';
                                question_html += SC.questions[i]["html"];

                                if(incr == (Object.keys(SC.questions).length-1))
                                    question_html += '</div>';

                            }else{

                                question_html += SC.questions[i]["html"];
                                question_html += '</div>';
                            }

                            // if there are only one question
                            question_html += Object.keys(SC.questions).length - questionsLcr.length == 1 ? '</div>': "";
                            SC.questions[i].display = true;

                            incr++;
                    }
                };

                var countStartDiv = (question_html.match(/<div/g) || []).length,
                    countEndDiv = (question_html.match(/<\/div>/g) || []).length;

                question_html += parseInt(countStartDiv) > parseInt(countEndDiv) ? "</div>" : ""; 
                question_html += "<!-- questions list -->";

                callback(question_html);

            }catch(e){

                SC.logs.push({"Questions object error": e});

                return "<div class='row'><p>They are no question</p></div>";
            }

        }else{
            SC.logs.push({"Parameters questions.json error":e})
        }
    },
    getLastTimeDiscussionInfo: function(_this_){

        var ID = _this_.getAttribute('data-id');

        var ltd = document.querySelector('#sm_ltd');

        var CALL = localStorage.getItem(ID);

        var html = "";

        if(CALL){
            CALL = JSON.parse(CALL);

            for(var e in CALL){
                
                if(typeof CALL[e].sequence == "object"){

                    // Timestamp array
                    for(var i in CALL[e].sequence.screen){

                            if(typeof CALL[e].sequence.screen == "object"){

                                    html += "<ul>"+
                                                "<li>"+CALL[e].sequence.screen[i].fm_screen_id+"</li>"+
                                                "<li>"+CALL[e].sequence.screen[i].crm_mv_name+"</li>"+
                                                "<li>"+CALL[e].sequence.screen[i].sm_feedback+"</li>"+
                                                "<li>"+CALL[e].sequence.screen[i].crm_mv_start+
                                            "</ul>";
                            }
                    }
                }
            }
        }

        ltd.classList.add('show'); 
        ltd.querySelector('.col-md-12').innerHTML = html;

    },
    /*
        Replace data from template for header
        @ filling : hcp firstname
        @ filling : hcp lastname
        @ filling : hcp speciality
        @ filling : hcp segment
        @ filling : hcp potential
        @ filling : hcp gender
        @ filling : hcp brand loyalty
        @ filling : hcp digital interest
        @ filling : hcp presentation interest
        @ filling : last call date
        @ filling : reps firstname
        @ filling : reps lastname
    */
    getHeaderInfos: function(callback,tmpl){

        var self = this;

        // Get HCP infos
        try{

          var firstname    = window.parent.context.customers.length > 0 ? window.parent.context.customers[0].firstname : "",
              lastname     = window.parent.context.customers.length > 0 ? window.parent.context.customers[0].lastname : "",
              speciality   = window.parent.context.customers.length > 0 ? window.parent.context.customers[0].specialty : "",
              segment      = HCP.get_segmentation(),
              potential    = HCP.get_potential();

              // display hcp name
              tmpl = tmpl.replace('{hcp}', firstname+" "+lastname);

              // Display speciality
              if(self.matrice_speciality.hasOwnProperty(speciality)){
                    speciality = self.matrice_speciality[speciality];
              }

              tmpl = tmpl.replace('{speciality}', speciality);

        }catch(e){
            SC.logs.push({"Window.parent.context HCP error template": e})
        }

        // If there are a call
        if(this.lcr.hasOwnProperty(this.ID)){

            var gender        = self.lcr[self.ID].infos.gender,
                lastcalldate  = self.lcr[self.ID].call[self.lcr[self.ID].call.length-1].calldate,
                repsFirstname = self.lcr[self.ID].call[self.lcr[self.ID].call.length-1].reps.crm_mv_firstname,
                repsLastname  = self.lcr[self.ID].call[self.lcr[self.ID].call.length-1].reps.crm_mv_lastname,
                displayed     = self.lcr[self.ID].call[self.lcr[self.ID].call.length-1].ser_pres_view_qty,
                comments      = self.lcr[self.ID].call[self.lcr[self.ID].call.length-1].lcr_reps_comments,
                presentationinterest = 0, brandLoyalty = 0, digitalInterest = 0;

              if(repsLastname.indexOf('_') != -1){
                 repsLastname = repsLastname.split('_')[0];
              }
              
            _date_ = lastcalldate ? new Date(lastcalldate) : null;

            // get last brand loyalty infos accross all call
            // get last digital interest infos accross all call
            // get last presentation interest infos accross all call
            for(var e in self.lcr[self.ID].call){

                if(self.lcr[self.ID].call[e].brand_loyalty){
                    brandLoyalty = self.lcr[self.ID].call[e].brand_loyalty;
                }

                if(self.lcr[self.ID].call[e].digital_interest){
                    digitalInterest = self.lcr[self.ID].call[e].digital_interest;
                }

                if(self.lcr[self.ID].call[e].presentation_interest)
                    presentationinterest = self.lcr[self.ID].call[e].presentation_interest;
            }
            

            try{tmpl = tmpl.replace('{gender}', gender ? gender : "...");}
            catch(e){SC.logs.push({"Lcr HCP gender error template":e})}

            try{tmpl = tmpl.replace('{lastcalldate}', _date_ ? _date_.toLocaleDateString("en-US",self.options): "...");}
            catch(e){SC.logs.push({"Lcr HCP lastcalldate error template":e})}

            try{tmpl = tmpl.replace('{brandLoyalty}', brandLoyalty ? "style='width:"+brandLoyalty+"%'" : "style='display:none;'");}
            catch(e){SC.logs.push({"Lcr HCP brand loyalty error template":e})}

            try{tmpl = tmpl.replace('{digitalInterest}', digitalInterest ? "style='width:"+digitalInterest+"%'" : "style='display:none;'");}
            catch(e){SC.logs.push({"Lcr HCP digital interest error template":e})}   

            try{tmpl = tmpl.replace('{presentationInterest}', presentationinterest ? "style='width:"+presentationinterest+"%'" : "style='display:none;'");}
            catch(e){SC.logs.push({"Lcr HCP presentation interest error template":e})}

            try{tmpl = tmpl.replace('{times_displayed}', displayed ? displayed : "...");}
            catch(e){SC.logs.push({"Lcr HCP time displayed error template":e})}

            try{tmpl = tmpl.replace('{comments}', comments ? comments : "...");}
            catch(e){SC.logs.push({"Lcr HCP comments error template":e})}

            try{tmpl = tmpl.replace('{reps}', repsFirstname && repsLastname ? repsFirstname+" "+repsLastname : "...");}
            catch(e){SC.logs.push({"Lcr reps error template":e})}

        }else{

            // if no record for hcp
            tmpl = tmpl.replace('{comments}','...');
            tmpl = tmpl.replace('{times_displayed}','...');
            tmpl = tmpl.replace('{reps}','...');
            tmpl = tmpl.replace('{lastcalldate}','...');
            tmpl = tmpl.replace('{presentationInterest}','');
            tmpl = tmpl.replace('{digitalInterest}','');
            tmpl = tmpl.replace('{brandLoyalty}','');
        }

        try{tmpl = tmpl.replace('{potential}', potential ? potential : "...");}
        catch(e){SC.logs.push({"Lcr HCP potential error template":e})}

        try{tmpl = tmpl.replace('{segment}', segment ? segment : "...");}
        catch(e){SC.logs.push({"Lcr HCP segment error template":e})}
        
        callback(tmpl);
    },
    getSeenPresentation: function(objPres){

         if(this.lcr.hasOwnProperty(this.ID)){

                 var tmp  = this.template_presentation(),
                     html = "",
                     none_clm_html = "";

                 try{

                         for(var e in this.lcr[this.ID].call[this.lcr[this.ID].call.length-1].presentations){

                                var tmp_ = tmp,
                                    presentation = this.lcr[this.ID].call[this.lcr[this.ID].call.length-1].presentations[e],
                                    incr = 0;

                                    tmp_ = tmp_.replace('{name}' , presentation.name);
                                    tmp_ = tmp_.replace(new RegExp('{key}', 'g'), (parseInt(e)+1));  

                                    var topic_list = "";

                                    for(var i in presentation.list){

                                        if(incr < 3){
                                            topic_list += "<span>- "+presentation.list[i]+"</span>";
                                        }

                                        incr++;
                                    }

                                    tmp_ = tmp_.replace('{maintopiclist}' , topic_list);
                                    tmp_ = tmp_.replace('{thumbnail}', 'media/images/thumbnails/200x150.jpg');
                                    tmp_ = tmp_.replace('{title}',"Main topics discussed:");
                                    tmp_ = tmp_.replace('{ID}', this.lcr[this.ID].call[this.lcr[this.ID].call.length-1].sm_callid);
                                    //presentation.thumb
                                    html += tmp_;
                         }

                         for(var e in this.lcr[this.ID].call[this.lcr[this.ID].call.length-1].none_clm_presentation){

                             none_clm_html += this.lcr[this.ID].call[this.lcr[this.ID].call.length-1].none_clm_presentation[e]+"<br>";
        
                         }

                         if(none_clm_html.length > 0){

                                    var tmp_ = tmp;
                                    tmp_ = tmp_.replace('{name}' , none_clm_html);
                                    tmp_ = tmp_.replace('{key}', " ");  
                                    tmp_ = tmp_.replace('{maintopiclist}' , " ");
                                    tmp_ = tmp_.replace('{thumbnail}', "http://sm.flowmaker.io/smart_content/current/css/images/nodigital.png");
                                    tmp_ = tmp_.replace('{title}'," ");
                                    tmp_ = tmp_.replace('{ID}', this.lcr[this.ID].call[this.lcr[this.ID].call.length-1].sm_callid);

                                    html += tmp_;
                         } 

                         return html;

                 }catch(e){

                    SC.logs.push({'Error lcr template get all presentations ':e});
                 }

         }

         return "<h4>No last time discussion</h4>";
    },
    getRecomandedPresentation: function(){

         if(this.lcr.hasOwnProperty(this.ID)){

                if(this.lcr[this.ID].call[ this.lcr[this.ID].call.length-1 ].hasOwnProperty('recommandations')){

                     var html = "";

                     var arrRecommandations = this.lcr[this.ID].call[ this.lcr[this.ID].call.length-1 ].recommandations;

                     for(var i in arrRecommandations){

                        var tmpl_category = "";

                        if(arrRecommandations[i].hasOwnProperty('category') &&
                           arrRecommandations[i].category.length > 0){

                            for(var e in arrRecommandations[i].category){
                                tmpl_category += "<span>- "+arrRecommandations[i].category[e]+"</span>";
                            }

                        }

                        if(arrRecommandations[i].state == "talk"){

                              var list_category = tmpl_category.length > 0 ? tmpl_category : "No category";
                              var tmp  = this.template_presentation();
                                  tmp  = tmp.replace('{thumbnail}',"js/_smart_content/css/images/recomanded_call.png");
                                  tmp  = tmp.replace('{key}',"");
                                  tmp  = tmp.replace('{name}',i);
                                  tmp  = tmp.replace('{title}',"Focus on:");
                                  tmp  = tmp.replace('{maintopiclist}', tmpl_category);

                                  html += tmp;
                        }
                        if(arrRecommandations[i].state == "donttalk"){

                              var tmp  = this.template_presentation();
                                  tmp  = tmp.replace('{thumbnail}',"js/_smart_content/css/images/not_recomanded_call.png");
                                  tmp  = tmp.replace('{class}',"red");
                                  tmp  = tmp.replace('{key}',"");
                                  tmp  = tmp.replace('{name}',i);
                                  tmp  = tmp.replace('{title}',"");
                                  tmp  = tmp.replace('{maintopiclist}', "");

                                  html += tmp;
                        }

                     }

                     return html;
                }
         }

         return "No content recommandations";

    },
    getInfosSeenPresentation: function(){

    },
    template_presentation: function(){

        //onclick="alert(\'{key}\')"
        
        return  '<div class="presentation {class}">'+
                    '<a class="position">{key}</a>'+
                    '<img width="92px" heigh="69px" class="thumb" src="{thumbnail}">'+
                    '<h3 class="title">{name}</h3>'+
                    '<h3 class="maintopic">{title}</h3>'+
                    '<a id="maintopic_list">{maintopiclist}</a>'+
                    '<a class="know_more" onclick="MENU.handle_event.show.ltd(this)" data-id="{ID}"></a>'+
                '</div>';
    },
    know_more: function(){

    },
    /*
         If all html is ready show it and add event listener
     */
    display_html: function(display_lcr,display_ncp){

            var self = this;

            var menu_div = document.querySelector("#sm_menu"),
                sm_lcr   = document.querySelector("#sm_lcr"),
                sm_ncp   = document.querySelector("#sm_ncp"),
                content  = document.querySelector('#stage .content.active');

            if(menu_div && sm_lcr && content && sm_ncp){

                menu_div.classList.add('visible');
                sm_lcr.classList.add('visible');
                sm_ncp.classList.add('visible');

                self.handle_event.init(self);

                if(display_lcr) 
                    setTimeout(function(){self.handle_event.show.lcr()},250);

            }else{

                setTimeout(function(){
                    self.display_html(display_lcr);
                }, 200);
            }
    },
    handle_event: {

        init: function(_this_){

            try{

                this.questions.slider(_this_);
                this.questions.btn(_this_);
                this.questions.dropdown(_this_);
                this.questions.textarea(_this_);

                // btn call events
                this.call.start(this);
                this.call.end(this);

                // ncp events
                this.ncp.noneClmProducts(_this_);

                this.closeAll(this);
                this.ncp.recomandations(_this_);

            }catch(e){
                SC.logs.push({"Menu handle event": e});
            }

        },
        burger: function(btn_burger,_this_){

            var self = this;

            btn_burger.addEventListener('click',function(){

                  if(window.parent.context.customers.length > 0){

                          if(_this_.firstShow == true) _this_.create();

                          if(this.classList.contains('show')) self.hide.menu();
                          else self.show.menu();

                  }else{
                        EL.show_popup('Warning' , 'Please select a physician to perform a call.');      
                  }

            },false);

        },
        /* 
           Listener to differents questions type
           When a answer is selected the value is added to the questions object 
           @ questions.id.answer
        */
        questions:{

            slider: function(_this_){

                    var self = this;

                    // Check if jquery is loaded
                    if ($) {

                        // Init all question slider
                        $('[slider]').each(function() {

                            var id = $(this).attr('id'),
                                step = $(this).attr('step');

                            if (typeof step !== typeof undefined && step !== false) {

                                $("#" + id).slider({
                                    step: 10,
                                    stop: function( event, ui ) {

                                        var Q_id = this.closest('[sm_id]').getAttribute('sm_id');
                                            SC.questions[Q_id].answer_value = ui.value;

                                        try{ window.parent.addData(Q_id, String(value)); }
                                        catch(e){ SC.logs.push({'window.parent.addData error':e}) }

                                    },
                                    start: function(){
                                        $(this).removeClass('default');

                                    }
                                });

                            } else {

                                $('#' + id).slider();
                            }
                        });


                    } else {

                        setTimeout(function() {
                            self.slider();
                        }, 200);
                    }
            },
            btn: function(_this_){

                var self= this;

                // Questions btn type
                var all_btn = document.querySelectorAll('[type="button"] [sm_answer]');

                for(var e in all_btn){

                        if(typeof all_btn[e] == "object"){

                            all_btn[e].addEventListener('click', function(){

                                    this.classList.add('show');
                                    var siblings = _this_.helper.getSiblings(this);

                                    var Q_id = this.closest('[sm_id]').getAttribute("sm_id");

                                    // Push answer in question object
                                    var sm_answer = this.getAttribute('sm_answer');

                                    SC.questions[Q_id].answer_value = this.getAttribute('sm_answer');
                                    try{ window.parent.addData(Q_id, String(value)); }
                                    catch(e){ SC.logs.push({'window.parent.addData error':e}) }

                                    for(var i in siblings){

                                        siblings[i].classList.remove('show');
                                    }

                            },false);

                        }
                }
            },
            dropdown: function(_this_){

                var all_drd = document.querySelectorAll('[type="dropdown"] select');

                for(var e in all_drd){

                    if(typeof all_drd[e] == "object"){

                        all_drd[e].addEventListener('change', function(){

                                var Q_id = this.closest('[sm_id]').getAttribute("sm_id");

                                // Push answer in question object
                                var value = this.value;

                                SC.questions[Q_id].answer_value = value;
                                try{ window.parent.addData(Q_id, String(value)); }
                                catch(e){ SC.logs.push({'window.parent.addData error':e}) }

                        },false);
                    }

                }
            },
            textarea: function(_this_){

                var all_txt = document.querySelectorAll('[type="textarea"] textarea');

                for(var e in all_txt){

                    if(typeof all_txt[e] == "object"){

                        all_txt[e].addEventListener('change', function(){

                                var Q_id = this.closest('[sm_id]').getAttribute("sm_id");

                                var value = this.value;
                                // Push answer in question object
                                SC.questions[Q_id].answer_value = value;
                                try{ window.parent.addData(Q_id, String(value)); }
                                catch(e){ SC.logs.push({'window.parent.addData error':e}) }
                                

                        },false);
                    }

                }
            }
        },
        call:{
            // Start last call report
            start: function(_this){

               var  sm_lcr   = document.querySelector("#sm_lcr [startCall]");

                    sm_lcr.addEventListener('click', function(){

                        _this.hide.lcr();

                    },false);
            },
            // End next call preparation
            end: function(_this){

               var  sm_ncp = document.querySelector("#sm_ncp [endCall]");

                    sm_ncp.addEventListener('click', function(){

                        if(window.parent.context.customers.length > 0){

                                _this.hide.ncp();
                                LCR.__construct();
                                
                        }else{
                            EL.show_popup('Warning' , 'Please select a physician to perform a post call.');
                        }

                    },false);
            }
        },
        show: {

            // Display page last call report
            lcr: function(){

                if(!MENU.lcr.hasOwnProperty(MENU.ID)){

                    EL.show_popup('Warning' , "There's no recorded call for this HCP.");

                }else{

                    var sm_lcr = document.querySelector('#sm_lcr');
                        sm_lcr.classList.add('show'); 
                }

            },
            // Display page next call preparation
            ncp: function(){

                var sm_ncp = document.querySelector('#sm_ncp');
                    sm_ncp.classList.add('show');
            },
            menu: function(){

                var stage = document.querySelector('#stage');
                    stage.classList.add('show');

                var burger = document.querySelector('#burger');
                    burger.classList.add('show');
            },
            km: function(){

                var km = document.querySelector('#sm_km');
                    km.classList.add('show');    
            },
            infos: function(){

                var name       = SC.data_flowmaker.fm_name,
                    version    = SC.data_flowmaker.fm_sequence_info.fm_seq_version.fm_seq_version_id;
                    exportDate = new Date(SC.data_flowmaker.fm_version.fm_version_export_date);
                    exportDate = exportDate.toLocaleDateString("en-US",MENU.options);

                EL.show_popup('Infos' , "<span>Name: "+name+"</span><br>"+"<span>Export date: "+exportDate+"</span>"+"<br><span>Version: "+version);  
            },
            // Last time discussion infos
            ltd: function(_this_){ 

                MENU.getLastTimeDiscussionInfo(_this_);
            }
        },
        hide: {

            // hide page menu
            menu: function(){

                var stage = document.querySelector('#stage');
                    stage.classList.remove('show');

                var burger = document.querySelector('#burger');
                    burger.classList.remove('show');
            },
            // hide page lcr
            lcr: function(){

                var sm_lcr = document.querySelector('#sm_lcr');
                    sm_lcr.classList.remove('show');
            },
            // hide pahe ncp
            ncp: function(){

                var sm_ncp = document.querySelector('#sm_ncp');
                    sm_ncp.classList.remove('show');
            },
            km: function(){

                var km = document.querySelector('#sm_km');
                    km.classList.remove('show');
            },
            ltd: function(){

                var ltd = document.querySelector('#sm_ltd');
                    ltd.classList.remove('show');         
            }
        },
        ncp:{

            noneClmProducts: function(_this_){

                var sm_nop = document.querySelectorAll('#ncp__other_products span');

                for(var e in sm_nop){

                      if(typeof sm_nop[e] == "object"){

                              sm_nop[e].addEventListener("click" , function(){

                                var name = this.getAttribute("name");

                                if(this.classList.contains('show')){

                                    this.classList.remove('show');

                                    var index = _this_.noneClmProducts.indexOf(name);

                                    if (index > -1) {
                                        
                                        _this_.noneClmProducts.splice(index, 1);
                                    }

                                }else{

                                    if(_this_.noneClmProducts.indexOf(name) == -1){

                                        _this_.noneClmProducts.push(name);
                                    }

                                    this.classList.add('show');
                                }

                            },false);

                      }
                }
            },
            recomandations: function(_this_){

                var reco = document.querySelectorAll('#ncp__recommandation span[name]');

                for(var e in reco){

                    if(typeof reco[e] == "object"){

                        reco[e].addEventListener("click",function(e){

                                e.preventDefault();
                                e.stopPropagation();

                                if(this.hasAttribute("name")){
                                    var ta = this.querySelector('#talkingabout');

                                    if(ta.classList.contains('show')){

                                        //this.classList.remove('show');
                                        ta.classList.remove('show');

                                    }else{

                                        //ta.classList.add('show');
                                        ta.classList.add('show');
                                    }
                                }

                        },false);

                    }
                }
            },
            talk: function(_this){

                var siblings = MENU.helper.getSiblings(_this);

                var btn = _this.closest('[name]');
                    name = btn.getAttribute('name');

                for(var e in siblings){
                    siblings[e].classList.remove('actived');
                }

                if(_this.classList.contains('actived')){
                    _this.classList.remove('actived');
                    btn.classList.remove('talk');

                    MENU.handle_event.ncp.setRecommandations(name,0);
                }else{
                    _this.classList.add('actived');

                    btn.classList.remove('donttalk');
                    btn.classList.add('talk');

                    MENU.handle_event.ncp.setRecommandations(name,"talk");
                }

            },
            donttalk: function(_this){

                var siblings = MENU.helper.getSiblings(_this);

                var btn  = _this.closest('[name]');
                    name = btn.getAttribute('name');

                for(var e in siblings){
                    siblings[e].classList.remove('actived');
                }

                if(_this.classList.contains('actived')){
                    _this.classList.remove('actived');

                    // Btn class
                    btn.classList.remove('donttalk');

                    MENU.handle_event.ncp.setRecommandations(name,"none");
                }else{
                    _this.classList.add('actived');

                    // Btn class
                    btn.classList.remove('talk');
                    btn.classList.add('donttalk');

                    MENU.handle_event.ncp.setRecommandations(name,"donttalk");
                }

            },
            category: function(event,_this){

                event.stopPropagation();
                var _parent = _this.closest('[name]'),
                    listcategory = _parent.querySelector('.listcategory');

                if(_this.classList.contains('actived')){
                    listcategory.style.display = "none";
                    _this.classList.remove('actived');
                }else{
                    listcategory.style.display = "block";
                    _this.classList.add('actived');
                }
            },
            listcategory: function( event , _this){

                event.stopPropagation();

                var _parent = _this.closest('[name]'),
                    name = _parent.getAttribute('name'),
                    cat  = _this.getAttribute('category');

                if(!MENU.recomandations.hasOwnProperty(name)){
                    
                    this.setRecommandations(name,0);
                }

                if(_this.classList.contains('actived')){

                    _this.classList.remove('actived');
                    var index = MENU.recomandations[name].category.indexOf(cat);
                    MENU.recomandations[name].category.splice(index,1);

                }else{
                    _this.classList.add('actived');
                    MENU.recomandations[name].category.push(cat);
                }

            },
            setRecommandations: function(name,_val_){

                if(MENU.recomandations.hasOwnProperty(name)){

                    MENU.recomandations[name].state = _val_;
                }else{

                    MENU.recomandations[name] = {};
                    MENU.recomandations[name].state = _val_;
                    MENU.recomandations[name].category = [];
                }
            },
            close: function(event,_this){

                event.stopPropagation();
                var parent = _this.closest('[name]');

                    parent.querySelector('.listcategory').style.display = "none";
                    parent.querySelector('.category').classList.remove('actived');
            }
        },
        closeAll: function(_this_){

            var stage = document.querySelector('#stage');

            stage.addEventListener('click' , function(){

                if(this.classList.contains('show')){

                    //_this_.hide.menu();
                    _this_.hide.lcr();
                    _this_.hide.ncp();
                }

            },false);

        }
    },
    makeRequest: function(url,callback){

        var httpRequest = false,
            _this = this;

        httpRequest = new XMLHttpRequest();

        if (!httpRequest) {
            alert('Abandon :( Impossible de créer une instance XMLHTTP');
            return false;
        }
        httpRequest.onreadystatechange = function() { 

                _this.alertContents(httpRequest,function(_response_){
                    callback(_response_);
                }); 
        };
        httpRequest.open('GET', url, true);
        httpRequest.send(null);
    },
    alertContents: function(httpRequest,callback) {

            try {
                if (httpRequest.readyState == 4) {
                    if (httpRequest.status == 200 || httpRequest.status == 0) {
                        callback(httpRequest.responseText)
                    } else {
                        alert("Un problème est survenu au cours de la requête.");
                    }
                }
            }
            catch( e ) {
                alert("Une exception s’est produite : " + e); 
            }
    },
    /*
        Get all questions
     */
    helper: {

        getSiblings: function(n) {

            function getChildren(n, skipMe){
                var r = [];
                for ( ; n; n = n.nextSibling ) 
                   if ( n.nodeType == 1 && n != skipMe)
                      r.push( n );        
                return r;
            }
            return getChildren(n.parentNode.firstChild, n);
        }
    }
}

MENU = Object.create(module_menu);