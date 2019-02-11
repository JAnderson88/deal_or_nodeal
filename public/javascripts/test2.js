import { type } from "os";

function randomCharachters(range = 0, types = []){
    var availables = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()";
    var password = "";
    //check to see if parameters are useable
    if(range === 0){
        return `Error did not provide a range`
    }
    if(types.length === 0){
        return `Did not provide a type`
    }   
    for(var i = 1; i<= range; i++){
        var random = Math.floor(Math.random() * availables.length);
        password += availables[random];
    }
}