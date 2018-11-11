var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

async function callLex(userId,message){
    return new Promise((resolve,reject)=>{
        let params = {
            botAlias: 'chatbot', /* required */
            botName: 'ChatBot', /* required */
            contentType: 'text/plain; charset=utf-8', /* required */
            inputStream: message, /* required */
            userId: userId, /* required */
            accept: 'text/plain; charset=utf-8'
        };
        var lexruntime = new AWS.LexRuntime();
        lexruntime.postContent(params, function (err, data) {
            if (err){
                console.log(err, err.stack); // an error occurred  
                reject(err);
            }else{
                console.log(data); // successful response
                resolve(data.message);
            }    
        });
    })
}


exports.handler = async (event) => {
    // TODO implement
    let body = JSON.parse(event.body);
    console.log(JSON.stringify(event));
    let reply = await callLex(event.requestContext.identity.user,body.message.data.text);
    
    const response = {
        statusCode: 200,
        headers: {
              'Access-Control-Allow-Origin':'*'
                }
            ,
        body: JSON.stringify({'author':`bot`,'type':'text','data' :{'text':reply}})
    };
    return response;
};