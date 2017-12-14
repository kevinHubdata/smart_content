var module_reps = {
    obj : {

            "crm_v_id" : null,
            "crm_mv_firstname": null,
            "crm_mv_lastname": null
    },
	__construct: function() {

        this.get_firstname();
        this.get_lastname();

        window.call.reps = this.obj;
	},
    get_id: function(){
        // Not available in MI
    },
    get_firstname: function(){
        try{
            var fullName = window.parent.context.parameters.employee_name;
            this.obj.crm_mv_firstname = fullName.split(',')[1]; 
        }catch(e){
            SC.logs.push({"Error reps name":e})  
        }
    },
    get_current_firstname: function(){
        try{
            var fullName = window.parent.context.parameters.employee_name;
                return fullName.split(',')[1]; 
        }catch(e){
            SC.logs.push({"Error reps name":e})  
        }
    },
    get_current_lastname: function(){
        try{
            var fullName = window.parent.context.parameters.employee_name;
                return fullName.split(',')[0];       
        }catch(e){
            SC.logs.push({"Error reps lastname":e})
        }
    },
    get_lastname: function(){
        try{
            var fullName = window.parent.context.parameters.employee_name;
            this.obj.crm_mv_lastname = fullName.split(',')[0];       
        }catch(e){
            SC.logs.push({"Error reps lastname":e})
        }
    },
    get_products: function(){
        // Not available in MI
    }
};

REPS = Object.create(module_reps);
REPS.__construct();
