var module_presentation = {

        p_index: null,
        q_index: null,

        obj : {
            "fm_presentation_id": null,
            "fm_presentation_version_id": null,
            "crm_mv_name": null,
            "crm_mv_validation_code": null,
            "crm_mv_order": "0",
            "crm_m_link_thumbnail": null,
            "fm_thumbnail": null,
            "date": {
                "crm_mv_start_date": null,
                "dev_start_date": null,
                "dev_end_date": null
            },
            "crm_mv_survey": []
        },
        __construct: function(){

            this.p_index = window.parent.getCurrentPresentation();
            this.q_index = window.parent.getCurrentSequence();
            if(this.p_index == null || this.q_index == null){
                SC.logs.push({"Presentation index error":"Not found"});
            }

            this.set_fm_presentation_id();
            this.set_fm_presentation_version_id();

            this.set_name();

            this.set_crm_mv_validation_code();
            this.crm_mv_order();

            this.date.crm_mv_start_date(this);
            this.date.dev_start_date(this);

            this.set_crm_m_link_thumbnail(this);
            this.set_fm_thumbnail();

            window.data.presentation = this.obj;
        },
        set_fm_presentation_id: function(){

            try{ this.obj.fm_presentation_id = SC.data_flowmaker[0].project.presentation.fm_presentation_id}
            catch(e){ SC.logs.push({"Error fm_presentation_id" : e})} 
        },
        set_fm_presentation_version_id: function(){
            
            try{ this.obj.fm_presentation_version_id = SC.data_flowmaker[0].project.presentation.fm_version.fm_version_id}
            catch(e){ SC.logs.push({"Error fm_presentation_id" : e})} 
        },
        set_name: function(){
            try{ this.obj.crm_mv_name = window.parent.context.presentations[this.p_index].name; }
            catch(e){SC.logs.push({"Error presentation name ": e})}
        },
        set_crm_mv_validation_code: function(){
            try{ this.obj.crm_mv_validation_code = window.parent.context.presentations[this.p_index].code;}
            catch(e){ SC.logs.push({"Error crm_mv_validation_code": e})}
        },
        crm_mv_order: function(){
            try{ this.obj.crm_mv_order = window.parent.context.presentationsOrderSeen;}
            catch(e){ SC.logs.push({"Error crm_mv_order" : e})} 
        },
        set_fm_thumbnail: function(){

            try{ this.obj.fm_thumbnail = SC.data_flowmaker[0].project.presentation.fm_presentation_thumbnail}
            catch(e){ SC.logs.push({"Error fm_thumbnail" : e})} 
        },
        set_crm_m_link_thumbnail: function(){
            try{ this.obj.crm_m_link_thumbnail = window.parent.context.presentations[this.p_index].thumbnail}
            catch(e){ SC.logs.push({"Error crm_m_link_thumbnail" : e})} 
        },
        date: {
             crm_mv_start_date: function(self){

                var date_ = window.parent.context.parameters.event_date;
                var hours = window.parent.context.parameters.event_time;

                try { self['obj']['date'].crm_mv_start_date = date_ +" "+ hours }
                catch (e) { SC.logs.push({"Error presentation crm_mv_start_date":e}); }
             },
             dev_start_date: function(self){

                 try{
                    self['obj']['date'].dev_start_date = Date.now();
                 }catch(e){
                    SC.logs.push({"Error presentation dev_start_date":e});
                 }
             },
             dev_end_date: function(self){

                 try{
                    self['obj']['date'].dev_end_date = Date.now();
                 }catch(e){
                    SC.logs.push({"Error presentation dev_end_date":e});
                 }
             }
        }
}

var PRESENTATION = Object.create(module_presentation);
PRESENTATION.__construct();