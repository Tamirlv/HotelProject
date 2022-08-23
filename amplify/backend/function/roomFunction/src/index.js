
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    if (event.httpMethod === 'GET') {
        const res = await getAllRoomsOfHotel(event.queryStringParameters.hotel_id);
        return {
            statusCode: 200,
            //  Uncomment below to enable CORS requests
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"

            },
            body: JSON.stringify(res.Items),
        };


    }
    if (event.httpMethod === 'POST') {
        let body = JSON.parse(event.body);
        const res = await createRoomInDynamo(body);
        return {
            statusCode: 200,
            //  Uncomment below to enable CORS requests
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"

            },
            body: JSON.stringify(res),
        };
    }
};


function createRoomInDynamo(hotel) {
    const params = {
        TableName: 'Rooms',
        Item: {
            id: AWS.util.uuid.v4(),
            hotel_id: hotel.hotel_id,
            name: hotel.name,
            amount: hotel.total_rooms
        }
    }
    return ddb.put(params).promise();
}

function getAllRoomsOfHotel(hotel) {
    const params = {
        TableName: "Rooms",
        KeyConditionExpression: "#hotel_id = :hotel_id",
        ExpressionAttributeNames: {
            "#hotel_id": "hotel_id"
        },
        ExpressionAttributeValues: {
            ":hotel_id": hotel
        },
        IndexName: 'hotel_id-index'
    };

    return ddb.query(params).promise();
}
