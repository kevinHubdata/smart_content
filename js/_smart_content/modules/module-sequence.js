var module_sequence = {

    obj : {

          "crm_mv_seq_name": null,
          "crm_m_seq_parameters_id": "MONO_1707_Dev_GLO_Comigral_1_20170727",
          "fm_seq_id": "uniq id",
          "fm_seq_version": "uniq id",
          "crm_mv_seq_feedback": null,
          "screen": []
    },
/*    obj:{  
        "crm_mv_seq_name": null,
        "crm_m_seq_parameters_id" : null,
        "crm_mv_attached_product": [],
        "crm_mv_screen_feedback": null,
        "screen": []
    },*/
    p_index: null,
    q_index: null,
	__construct: function() {

        this.p_index = window.parent.getCurrentPresentation();
        this.q_index = window.parent.getCurrentSequence();

        this.get_crm_mv_seq_name();
        this.get_crm_m_seq_parameters_id();
        this.get_crm_mv_attached_product();
        this.get_fm_seq_id();
        this.get_fm_seq_version();

        window.data.sequence = this.obj;
	},
    get_crm_mv_seq_name: function(){
        try{
            this.obj.crm_mv_seq_name = window.parent.context.presentations[this.p_index].sequences[this.q_index].name;    
        }catch(e){
            SC.logs.push({"Error crm_mv_seq_name":e})
        }
    },
    get_crm_m_seq_parameters_id: function(){
        try{
            this.obj.crm_m_seq_parameters_id = window.parent.context.presentations[this.p_index].sequences[this.q_index].externalid;
        }catch(e){
            SC.logs.push({"Error sequence zipName":e})
        }
    },
    get_crm_mv_attached_product: function(){
        try{
            var productId = window.parent.context.presentations[this.p_index].sequences[this.q_index].product_id;
            if(productId){
                this.obj.crm_mv_attached_product[0] = window.parent.context.presentations[this.p_index].sequences[this.q_index].product_id;
            }            
        }catch(e){
            SC.logs.push({"Error sequence related products":e})
        }
    },
    get_fm_seq_id: function(){

        try{ this.obj.fm_seq_id = SC.data_flowmaker[0].project.sequence[0].fm_sequence_id}
        catch(e){SC.logs.push({"Error fm_seq_id":e})}     
    },
    get_fm_seq_version: function(){

        try{ this.obj.fm_seq_version = SC.data_flowmaker[0].project.sequence[0].fm_sequence_version}
        catch(e){SC.logs.push({"Error fm_seq_id":e})}     
    }
};

SEQUENCE = Object.create(module_sequence);
SEQUENCE.__construct();