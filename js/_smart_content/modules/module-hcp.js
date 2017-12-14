var module_hcp = {
	__construct: function(callback) {
        
        window.call.hcp = [];

        if(window.parent.context.customers.length > 0){

            for(var e in window.parent.context.customers){

                var customer = {};

                customer.id = this.get_id(e);
                customer.crm_onekey = this.get_onekey(e);
                customer.crm_firstname = this.get_firstname(e);
                customer.crm_lastname = this.get_lastname(e);
                customer.crm_email = this.get_email(e);
                customer.crm_speciality = this.get_speciality(e);
                customer.crm_segmentation = this.get_segmentation(e);
                customer.crm_addresses = this.get_addresses(e);
                
                window.call.hcp.push(customer);
            }
        }

    callback();
	},
    get_id: function(e){
       try{ return window.parent.context.customers[e].id;}
       catch(e) { SC.logs.push({"Error customer id":e})}
    },
    get_onekey: function(e){
       try{ return window.parent.context.customers[e].onekeyid;}
       catch(e){ SC.logs.push({"Error customer onekeyid":e})}  
    },
    get_firstname: function(e){
       try{ return window.parent.context.customers[e].firstname; }
       catch(e){ SC.logs.push({"Error customer firstname": e})}
    },
    get_lastname: function(e){
       try{ return window.parent.context.customers[e].lastname; }
       catch(e) { SC.logs.push({"Error customer lastname": e})}
    },
    get_current_firstname: function(e){
       try{ return window.parent.context.customers[0].firstname; }
       catch(e){ SC.logs.push({"Error customer firstname": e})}
    },
    get_current_lastname: function(e){
       try{ return window.parent.context.customers[0].lastname; }
       catch(e) { SC.logs.push({"Error customer lastname": e})}
    },
    get_email: function(e){
       try{ return window.parent.context.customers[0].email; }
       catch(e) { SC.logs.push({"Error customer email":e})}
    },
    get_gender: function(e){
        // not available in MI
    },
    get_speciality: function(e){
        try{ return window.parent.context.customers[e].specialty; }
        catch(e){ SC.logs.push({"Error customer speciality": e})}
    },
    get_potential: function(){

        try{return window.parent.context.customers[0].segments[0].valuemin}
        catch(e){ SC.logs.push({"Error hcp potential":e})}

    },
    get_segmentation: function(e){

        try{return window.parent.context.customers[0].segments[0].name}
        catch(e){ SC.logs.push({"Error hcp segmentation":e})}

    },
    get_territory: function(){
        // not available in MI  
    },
    get_addresses: function(e){
        try{ return window.parent.context.customers[e].addresses; }catch(e){ SC.logs.push({"Error customer addresses":e})}
    },
    rating: function(){
        // not available in MI
    }
};

HCP = Object.create(module_hcp);