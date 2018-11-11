// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set region
AWS.config.update({region: 'us-east-1'});
var dynamodb = new AWS.DynamoDB.DocumentClient({convertEmptyValues :true});
var https = require('https');

async function writeIntoDB(key,val){
  return new Promise((resolve,reject)=>{
    val.messageId = key;
    var params = {
      TableName: 'chatbot-req',
      Item: val
    };
  
    // Call DynamoDB to add the item to the table
    dynamodb.put(params, function(err, data) {
      if (err) {
        reject(err);
        console.log("Error", err);
      } else {
        resolve(data);
        console.log("Success", data);
      }
    });
  });
}

async function getRecs(cuisine,time,location){
  return new Promise((resolve,reject ) => {
    let date = new Date();
    let destructedTime = time.split(':');
    if (destructedTime.length == 2 ){
      date.setHours(destructedTime[0],destructedTime[1]);
    }
    const options = {
            host: 'api.yelp.com',
            path: '/v3/businesses/search?term=' + encodeURIComponent(cuisine) 
            + "&location=" + encodeURIComponent(location)
            + "&open_at=" + Math.floor(date / 1000),
            headers: {"Authorization":"Bearer iLqgUMViX9658v38ONsvX4Wt_1TPlsE-nMigkVjM46PuhBAf-E7DdkViA448eyJZliy9ZIn6YDjZ5NLbyMzaQHAVKIr9F5RXBG4Nbi6HaGpWBhxUXyOonpPxIRDeW3Yx"}
        };
        var data = "";
        const req = https.get(options, (res) => {
          //console.log(res);
          res.on('data',(d)=>{
            data += d;
          })
          
          res.on('end',()=>{
            //console.log(data);
            resolve(JSON.parse(data));
          })
        });

        req.on('error', (e) => {
          reject(e.message);
        });
  })
}

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    for (let i = 0; i< event.Records.length;++i){
        let record = event.Records[i];
        console.log('SQS message %s: %j', record.messageId, record.body);
        let userMessage = JSON.parse(record.body);
      
        // Create publish parameters
        
        let recs = await getRecs(userMessage.Cuisine, userMessage.DiningTime, userMessage.Location);
        let dbData = await writeIntoDB(record.messageId,recs);
        let textResponse = "Here are my " + userMessage.Cuisine + " restaurant suggestions for " + userMessage.NumPeople + " people, for today at " + userMessage.DiningTime + ". ";
        for (let i = 0;i<recs.businesses.length && i < 3;++i){
            let place = recs.businesses[i];
            textResponse += i+1 + ". " + place.name + " located at " + place.location.display_address[0] + " ";
        }
        textResponse += ". Enjoy!";
        var params = {
          Message: textResponse, /* required */
          PhoneNumber: '+1' + userMessage.Phone,
        };
        
        console.log(params);
        // Create promise and SNS service object
        try {
            //let data = await new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
            //console.log("MessageID is " + data.MessageId);
            
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }
    return `Successfully processed ${event.Records.length} messages.`;
};
