document.addEventListener('DOMContentLoaded', function() {

document.getElementById('sd').innerHTML = getFormatedDate() + '\n' + getFormatedDate(1);

document.getElementById('replace-btn').onclick = function(){
    loadDataFromInputs();

    var replacedText = replaceText();
    console.log(replacedText);
    document.getElementById('replaced-text').value = replacedText;
    document.getElementById('replaced-text').select();
    document.execCommand('copy');
}

document.getElementById('copy-time').onclick = function(){
    window.getSelection().selectAllChildren( document.getElementById( 'sd') );
    document.execCommand('copy');
};

});

var _value = -1;
var _rfid = -1;
var _clientId = -1;
var _event = -1;
var selectedTemplate = -1;

const MQ_SCALE_ID = 'mq-scale';
const MQ_EQ_EVENT_ID =  'mq-equipement-event';

function loadDataFromInputs(){
    _clientId = document.getElementById('input-client-id').value;
    _rfid = document.getElementById('input-rfid').value;
    _value = document.getElementById('input-value').value;
    _event = document.getElementById('select-event').value;
    selectedTemplate = document.getElementById('select-template').value;
    
}

function setSelected(template){
    selectedTemplate = template;
}

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
    return currDate.getFullYear() + "-" + n(currDate.getMonth()+1) + "-" + n(currDate.getDate()) + "T" + n(currDate.getHours() - 1) + ":" + n(currDate.getMinutes() + addMinutes) + ":" + n(currDate.getSeconds()) + ".000+02:00"
}

function replaceWithoutTemplate(){
    var retValStr = document.getElementById('text-to-replace').value;
}

function replaceText(){
    var choice = replaceWithoutTemplate;
    switch (selectedTemplate) {
        case MQ_SCALE_ID:
            choice = getScaleObj;
            break;
        case MQ_EQ_EVENT_ID:
            choice = getEquipementEventObj;
            break;
    
        default:
            break;
    }


    return getFinalReplaceStr(choice, {
        value: _value,
        rfid: _rfid,
        clientId: _clientId,
        event: _event
    });
}

function getReplacedTdr(fromStr, templateName, key, value){
    return fromStr.replace("{{tdr."+templateName+"."+key+"}}", value);
};

function getFinalReplaceStr(templateFunctionObj, valuesToReplace){
    var tmpFunction = templateFunctionObj();
    var retValStr = tmpFunction.template;
    for(element in tmpFunction.values){
        if(valuesToReplace[element]){
            retValStr = getReplacedTdr(retValStr, tmpFunction.id, element, valuesToReplace[element]);
        } else {
            retValStr = getReplacedTdr(retValStr, tmpFunction.id, element, tmpFunction.values[element]);
        }
    };
    
    return retValStr;
}

function getEquipementEventObj(){
    return {
        id: MQ_EQ_EVENT_ID,
        template: getEquipementEventStr(),
        values: {
            clientId: "VychystavaiePracovisko01",
            rfid:"A001",
            startTime: getFormatedDate(),
            endTime: getFormatedDate(1),
            event: "ARRIVED"
        }
    }
}

function getScaleObj(){
    return {
        id: MQ_SCALE_ID,
        template: getScaleStr(),
        values: {
            value: '{{tdr.mq-scale.value}}'
        }
    }
}


function getEquipementEventStr(){
    var tmp = 
    '   {  '  + "\n" +
    '     "clientId": "{{tdr.mq-equipement-event.clientId}}",  '  + "\n" +
    '     "rfid": "{{tdr.mq-equipement-event.rfid}}",  '  + "\n" +
    '     "startTime": "{{tdr.mq-equipement-event.startTime}}",  '  + "\n" +
    '     "endTime": "{{tdr.mq-equipement-event.endTime}}",  '  + "\n" +
    '     "event": "{{tdr.mq-equipement-event.event}}"  '  + "\n" +
    '  }  ' ; 
    return tmp;
}

function getScaleStr(){
    var tmp = 
    '   {  '  + "\n" +
    '     "type": "pageData",  '  + "\n" +
    '     "data": {  '  + "\n" +
    '       "pageData": {  '  + "\n" +
    '         "largeScale": {  '  + "\n" +
    '           "type": "Net",  '  + "\n" +
    '           "value": 0,  '  + "\n" +
    '           "unit": "kg",  '  + "\n" +
    '           "overload": {  '  + "\n" +
    '             "value": false  '  + "\n" +
    '           },  '  + "\n" +
    '           "underload": {  '  + "\n" +
    '             "value": false  '  + "\n" +
    '           },  '  + "\n" +
    '           "standstill": {  '  + "\n" +
    '             "value": true  '  + "\n" +
    '           },  '  + "\n" +
    '           "net": {  '  + "\n" +
    '             "value": {{tdr.mq-scale.value}}  '  + "\n" +
    '           }  '  + "\n" +
    '         }  '  + "\n" +
    '       }  '  + "\n" +
    '     }  '  + "\n" +
    '   }  '  + "\n" +
    '     '  + "\n" +
    '    ' ; 

    return tmp;
}