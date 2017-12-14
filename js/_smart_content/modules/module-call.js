var module_call = {

    obj:{
      "sm_callid": null,
      "crm_v_callid": null,
      "crm_mv_closedType": null,
      "crm_mv_is_preview": false,
      "date": {
          "dev_start_date": null,
          "crm_mv_start_date": null,
          "dev_end_date": null
      }
    }, 
	__construct: function() {

        this.date.dev_start_date(this);
        this.date.crm_mv_start_date(this);

        window.call.call = this.obj;
	},
    get_crm_v_callid: function(){
        //window.data.call.crm_v_callid
    },
    date:{
        
        dev_start_date: function(self){

            try { self.obj.date.dev_start_date = Date.now() }
            catch (e) { SC.logs.push({"Error call dev_Start_date":e}); }
        },
        crm_mv_start_date: function(self){

            var date_ = window.parent.context.parameters.event_date;
            var hours = window.parent.context.parameters.event_time;

            try { self.obj.date.crm_mv_start_date = date_ +" "+ hours }
            catch (e) { SC.logs.push({"Error call crm_mv_start_date":e}); }
        }
    }
};

CALL = Object.create(module_call);
CALL.__construct();
