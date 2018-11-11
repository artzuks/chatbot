// JavaScript File

class DiningIntent {
    
    constructor(slots) {
        this.slotsToFill = {
            'Location': {value:null,'priority':0,'invokeMessage':"What city will you be dining in?"},
            'Cuisine': {value:null,'priority':1,'invokeMessage':'What type of food are you intested in?'},
            'DiningTime': {value:null,'priority':2,'invokeMessage':"When will you be eating?"},
            'NumPeople': {value:null,'priority':3,'invokeMessage':"How many people will be dining?"},
            'Phone': {value:null,'priority':4,'invokeMessage':"What is your phone number?"}
        };
        for (let slot in slots){
            if (slot === "DiningTime"){
                this.slotsToFill[slot].value = this.validateTime(slots[slot]);
            }else{
                this.slotsToFill[slot].value = slots[slot];    
            }
            
        }
        
        
    }
    
    validateTime(time){
        switch (time){
            case "MO":
                return "07:00"
            case "AF":
                return "12:00"
            case "EV":
                return "18:00"
            case "NI":
                return "01:00"
            default:
                return time;
        } 
    }
    
    isDone(){
        for (let slot in this.slotsToFill){
            if (this.slotsToFill[slot].value === null){
                return false;
            }
        }
        return true;
    }
    
    nextSlot(){
        for (let slot in this.slotsToFill){
            if (this.slotsToFill[slot].value === null){
                return slot;
            }
        }
        return null;
    }
    
    getMessage(slotname){
        return this.slotsToFill[slotname].invokeMessage;
    }
    
    getSlots(){
        let ret = {};
        for (let slot in this.slotsToFill){
            ret[slot] = this.slotsToFill[slot].value;
        }
        return ret;
    }
}

module.exports = DiningIntent;