
var module_lcr = {

    ID: null,
    hcp_obj: null,
    currentCall: null,
    __construct: function(){

             try{
                this.ID = window.parent.context.customers[0].onekeyid;    
             }catch(e){
                SC.logs.push({"HCP onekeyid error": e});
             }

            // If local storage doesn't exist
            if(localStorage.getItem("HCP") == null)
                localStorage.setItem("HCP",JSON.stringify({}));

            if(this.ID && this.ID.length != 0){
                this.getCurrentCall();
                this.init();
            }
    },
    init: function(){

        this.hcp_obj = JSON.parse(localStorage.getItem("HCP"));

        // If hcp exist
        if(this.hcp_obj.hasOwnProperty(this.ID))
            this.update()
        else
            this.create();

    },
    create: function(){

        this.hcp_obj[this.ID] = {};

        // infos data
        this.hcp_obj[this.ID]["infos"] = {

            "crm_mv_firstname": HCP.get_current_firstname(),
            "crm_mv_lastname": HCP.get_current_lastname(),
            "crm_mv_speciality": HCP.get_speciality(),
            "crm_mv_potential": HCP.get_potential(),
            "crm_mv_segment": HCP.get_segmentation(),
            "sm_lcr_gender": SC.questions["Q01"].answer_value,
            "sm_lcr_phone": "",
            "sm_lcr_mail": "",
        }

        // call data
        this.hcp_obj[this.ID]["call"] = [];
        this.hcp_obj[this.ID]["call"].push(this.getCall());

        // update local storage
        localStorage.setItem("HCP",JSON.stringify(this.hcp_obj));
        EL.postcall_action();
    },
    update: function(){

        this.hcp_obj[this.ID].call.push(this.getCall());

        // If gender is updated
        if(SC.questions["Q01"].answer_value)
            this.hcp_obj[this.ID].infos.gender = SC.questions["Q01"].answer_value

        // If mail
        var email = document.querySelector('#sm_km_mail');

        if(email)
            this.hcp_obj[this.ID].infos.mail = email.value;

        // If mail
        var phone = document.querySelector('#sm_km_phone');
        if(phone)
            this.hcp_obj[this.ID].infos.phone = phone.value;

        // update local storage
        localStorage.setItem("HCP",JSON.stringify(this.hcp_obj));
        EL.postcall_action();
    },
    getCall: function(){

        var self = this;

        try{

            var call =  {

                "calldate": this.currentCall[0].call.date.dev_start_date,
                "fm_id": SC.data_flowmaker.fm_id,
                "sm_callid": this.currentCall[0].call.sm_callid,
                "ser_pres_view_qty": 1,
                "lcr_digital_interest": SC.questions["Q03"].answer_value,
                "lcr_brand_loyalty": SC.questions["Q02"].answer_value,
                "lcr_presentation_interest": SC.questions["Q04"].answer_value,
                "reps":{
                    "crm_mv_firstname": REPS.get_current_firstname(),
                    "crm_mv_lastname": REPS.get_current_lastname()     
                },
                "lcr_reps_comments": SC.questions["Q00"].answer_value,
                "questions": self.getQuestions(),
                "presentations": self.getPresentations(),
                "none_clm_presentation": MENU.noneClmProducts,
                "recommandations": MENU.recomandations
            }
            return call;

        }catch(e){
            SC.logs.push({"Lcr get call error ":e});
        }
    },
    getQuestions: function(){

        var questions_  = {},
            productID   = SC.data_flowmaker[0].project.presentation.fm_presentation_product_id,
            answer_date =  this.currentCall[0].call.date.dev_start_date;

        // If the question to an answer then it is related to the object
        for(var e in SC.questions){

            if(SC.questions[e].answer_value != null){

                // If question displayed while the call
                if(SC.questions[e].hasOwnProperty("display") && SC.questions[e].display == true)
                        questions_[e].display = true;

                questions_[e].answer_value = SC.questions[e].answer_value;
                questions_[e].product_id   = productID;
                questions_[e].answer_date  = answer_date;

                if(SC.questions[e].hasOwnProperty("never_asked_since"))
                        questions_[e].never_asked_since = SC.questions[e].never_asked_since;
                else
                        questions_[e].never_asked_since = 0;
            }

        }

        return questions_;
    },
    getCurrentCall: function(){

       try{
         this.currentCall = JSON.parse(localStorage.getItem(SC.UID));
       }catch(e){
          SC.logs.push({"Can not possible to open current call":e});
       }
       
    },
    getPresentations: function(){

        // get local storage
        try{

                var ls    = JSON.parse(localStorage.getItem(SC.UID)),
                    data  = [];

                if(ls){

                    for(var e in ls){

                        if(e > 0){

                            var obj = {
                                  thumb: null,
                                  name:null,
                                  list:[]
                            };

                            if(ls[e].presentation.hasOwnProperty("crm_m_thumbnail")){
                                obj.thumb = ls[e].presentation.crm_m_thumbnail;    
                            }
                            if(ls[e].presentation.hasOwnProperty('crm_mv_name')){
                                obj.name  = ls[e].presentation.crm_mv_name;
                            }

                            for(var i in ls[e].sequence.screen){

                                obj.list.push(ls[e].sequence.screen[i].crm_mv_name);
                            }
                            data.push(obj);

                        }
                    }

                }
                return data;

        }catch(e){

            SC.logs.push({"Error get call for LCR": e});

            return "";
        }
    },
    getNoneClmPresentation: function(){

        var sm_nop_input = document.querySelector('#sm_ncp #ncp__other_freetext input');

        if(sm_nop_input){
            MENU.noneClmProducts.push(sm_nop_input.value);
        }

        return MENU.noneClmProducts;
    }
}

LCR = Object.create(module_lcr);