
module.exports.getDate = function(){
    let d = new Date();
    var options = {
    weekday: "long", 
    day : "2-digit", 
    month: "short",
    };
    let info = d.toLocaleString("en-IN", options);
return info;
}
module.exports.getDay = function(){
    let d = new Date();
    var options = {
    weekday: "long",
    };
    let info = d.toLocaleString("en-IN", options);
return info;
}