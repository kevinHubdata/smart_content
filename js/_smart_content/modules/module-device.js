var module_device = {
    obj: {

            "location" : {
                "dev_longitude": null,
                "dev_latitude": null
            },
            "date": null,
            "dev_userAgent": null,
            "dev_language" : null,
            "dev_orientation": [],
            "crm_m_rotation_blocked": null,
            "crm_m_cache_memory_warning": null,
            "dev_local_storage_capacity": null,
            "dev_local_storage_total_call": 0,
            "dev_local_storage_total_lcr": 0
    },
    p_index: null,
    q_index: null,
	__construct: function() {
        this.p_index = window.parent.getCurrentPresentation();
        this.q_index = window.parent.getCurrentSequence();
        if(this.p_index === null || this.q_index === null){
            
            SC.logs.push({"Error index":"not found"});
            return false;
        }
		this.set_language();
        this.set_date();
        this.set_userAgent();
        this.set_orientation();
        this.set_rotationBlocked();
        this.set_location();
        this.set_localStorage_capacity();

        window.call.device = this.obj;
	},
    set_language: function(){

        try { this.obj.dev_language = navigator.language; }
        catch (e) { SC.logs.push({"Error device language":e}); }
    },
    set_date: function(){
        try{ this.obj.date = Date(); }
        catch (e) { SC.logs.push({"Error device date":e}); }
    },
    set_userAgent: function(){
        try{ this.obj.dev_userAgent = navigator.userAgent; }
        catch (e) { SC.logs.push({"Error device userAgent":e}) }  
    },
    set_orientation: function(){

        try{ this.obj.dev_orientation = window.parent.context.presentations[this.p_index].sequences[this.q_index].orientation; }
        catch (e) { SC.logs.push({"Error device orientation" : e })}
    },
    set_rotationBlocked: function(){
        try{ this.obj.crm_m_rotation_blocked = window.parent.context.parameters.hideRotateButton; }
        catch (e) { SC.logs.push({"Error rotation blocked" : e})}
    },
    set_location: function(){

        var self = this;
        try{
            if(navigator.geolocation){

                navigator.geolocation.getCurrentPosition(function(position){
                        self.obj.location.dev_longitude = position.coords.longitude;
                        self.obj.location.dev_latitude = position.coords.latitude;
                });
            }     
        }catch(e){
            SC.logs.push({"Error geolocalisation": e})
        }

    },
    set_cache_memory_warning: function(val){
        try{ this.obj.crm_m_cache_memory_warning = val;}
        catch (e) { SC.logs.push({"Error device cache warning": e})}
    },
    set_localStorage_capacity: function(){

        var _lsTotal = 0,
            i = 0,
            _xLen, _x;
        try{

            for (_x in localStorage) {
                _xLen = ((localStorage[_x].length + _x.length) * 2);
                _lsTotal += _xLen;

                if(_x.substr(0, 50).length == 36){
                    i++;
                }
            };
        }catch (e) { SC.logs.push({"set_localStorage_capacity" : e})}

        try{ this.obj.dev_local_storage_total_call = i}
        catch (e) { SC.logs.push({"dev_local_storage_total_call" : e})}

        try{ this.obj.dev_local_storage_capacity = (_lsTotal / 1024).toFixed(2) + " KB"}
        catch (e) { SC.logs.push({"dev_local_storage_capacity" : e})}

        try{ this.dev_local_storage_total_lcr = Object.keys(JSON.parse(localStorage.getItem('HCP'))).length }
        catch (e) { SC.logs.push({"dev_local_storage_total_lcr" : e})}
    }

};

DEVICE = Object.create(module_device);
DEVICE.__construct();

