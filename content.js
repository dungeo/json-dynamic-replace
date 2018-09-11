document.addEventListener('DOMContentLoaded', function() {

document.getElementById('sd').innerHTML = getFormatedDate();
document.getElementById('ed').innerHTML = getFormatedDate(1);


});

function n(n){
    return n > 9 ? "" + n: "0" + n;
}

function getFormatedDate(s){
    var currDate = new Date();
    var dateString = "${}--%sT%s:%s:%s.000+02:00";
    var addMinutes = 0;
    if(s){
        addMinutes = s; 
    }
    return currDate.getFullYear() + "-" + n(currDate.getMonth()+1) + "-" + n(currDate.getDate()) + "T" + (currDate.getHours() - 1) + ":" + (currDate.getMinutes() + addMinutes) + ":" + currDate.getSeconds() + ".000+02:00"
}