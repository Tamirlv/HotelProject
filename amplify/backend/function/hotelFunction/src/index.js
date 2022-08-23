// var uuid = require('uuid');
// console.log(uuid.v4());
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    if (event.httpMethod === 'GET') {
        const res = await getHotelsFromDynamo();
        console.log(`EVENT: ${JSON.stringify(event)}`);
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify(res.Items),
        };
    }
    if (event.httpMethod === 'POST') {
        const res = await createHotelInDynamo(JSON.parse(event.body))
        console.log('event', event, 'res', res);
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"

            },
            body: JSON.stringify(res),

        };
    }
};

function getHotelsFromDynamo() {
    const params = {
        TableName: 'Hotels',
        Limit: 10
    }
    return ddb.scan(params).promise();
}
function createHotelInDynamo(hotel) {
    const params = {
        TableName: 'Hotels',
        Item: {
            id: AWS.util.uuid.v4(),
            name: hotel.name,
            adress: hotel.address,
            image: hotel.image
        }
    }
    return ddb.put(params).promise();
}