exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
        headers: {
              'Access-Control-Allow-Origin':'*'
                }
            ,
        body: JSON.stringify({'author':`bot`,'type':'text','data' :{'text':"Lambda Here!"}})
    };
    return response;
};
