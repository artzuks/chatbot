// Load the SDK for JavaScript
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-2'});

var DiningIntent = require('diningIntentHandler');

async function sendToSQS(slots){
    return new Promise((resolve, reject) => {
        var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
        var params = {
           MessageBody: JSON.stringify(slots),
           QueueUrl: "https://sqs.us-east-1.amazonaws.com/317105563430/chatbot"
        };
        
        
        sqs.sendMessage(params, function(err, data) {
          if (err) {
              reject(err);
              console.log("Error", err);
          } else {
              resolve(data.MessageId)
              console.log("Success", data.MessageId);
          }
        });
    })
}

exports.handler = async (event) => {
    // TODO implement
    console.log(JSON.stringify(event));
    if (event.currentIntent.name === "GreetingIntent"){
        const response = {
            "dialogAction": {
                    "type": "Close",
                    "fulfillmentState": "Fulfilled",
                    "message": {
                        "contentType": "PlainText",
                        "content": "Hi there, I am designed to help you find a restaurant. Please let me know how I can help you!"
                    }
            }
            
        }
        return response;
    }else if (event.currentIntent.name === "DiningSuggestionsIntent") {
         const response = {
            "dialogAction": {
                    "type": "Close",
                    "fulfillmentState": "Fulfilled",
                    "message": {
                        "contentType": "PlainText",
                        "content": "Thanks! You should recieve a SMS with your recommendations!"
                    },
                    
            },
            
            
        }
        
        var handler = new DiningIntent(event.currentIntent.slots);
        if (! handler.isDone()){
            response.dialogAction.type = "ElicitSlot";
            response.dialogAction.intentName = event.currentIntent.name;
            response.dialogAction.fulfillmentState = undefined;
            response.dialogAction.slotToElicit = handler.nextSlot();
            response.dialogAction.slots = handler.getSlots();
            response.dialogAction.message.content = handler.getMessage(response.dialogAction.slotToElicit);
        }else{
            await sendToSQS(event.currentIntent.slots);
        }
        console.log(JSON.stringify(response));
        return response;
    }
    
};