const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const body = JSON.parse(event.body);
    if (event.httpMethod === 'POST') {
        if (!await MultiDailyReservationCheck(body)) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'User already booked for today',
                    status: 'error'
                }),
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*"
                }
            }
        }
        const dateFrom = new Date(body.from).valueOf(); // From date in the new reservation
        const dateTo = new Date(body.to).valueOf(); //  To date in the new reservation
        const specificRoom = await getSpecificRoom(body.room_id); // Get the room the user wants to book
        const maxRooms = specificRoom.Items[0].amount; // Get the room amount of the hotel
        const getReservations = await getRoomReservations(body.room_id); // Get Reservations of the room

        let counter = 0;
        for (let item of getReservations.Items) {
            if ((dateFrom <= item.date_to && dateTo >= item.date_from)) {
                // couting rooms in use in timeline
                counter++;
                if (counter >= maxRooms) {
                    // No availible rooms
                    return {
                        statusCode: 200,
                        body: JSON.stringify({
                            message: 'No availibe rooms in those dates',
                            staus: 'error'
                        }),
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "*"
                        }
                    }
                }
            }
        }

        try {
            const bookRoom = await bookRoomToDynamo(body, dateFrom, dateTo);
            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*"
                },
                body: JSON.stringify({
                    message: 'Success',
                    status: 'ok'
                }),
            };
        } catch (err) {
            return err;
        }
    }

    if (event.httpMethod === 'GET') {
        const res = await getReservationsFromDynamo();
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify(res.Items),
        };
    };
};


function getReservationsFromDynamo() {
    const params = {
        TableName: 'Reservations',
    }
    return ddb.scan(params).promise();
}

async function MultiDailyReservationCheck(reservation) {
    const userReservations = await getReservationsForSpecificUser(reservation);
    console.log("userReservations", userReservations.Items)

    const dateFrom = new Date(reservation.from).valueOf(); // From date in the new reservation
    const dateTo = new Date(reservation.to).valueOf(); //  To date in the new reservation
    for (let element of userReservations.Items) {
        if (dateFrom <= element.date_to && dateTo >= element.date_from)
            return false;
    };
    return true;
}

async function getRoomReservations(room_id) {
    const params = {
        TableName: "Reservations",
        KeyConditionExpression: "#room_id = :room_id",
        ExpressionAttributeNames: {
            "#room_id": "room_id"
        },
        ExpressionAttributeValues: {
            ":room_id": room_id
        },
        IndexName: 'room_id-index'
    };

    return ddb.query(params).promise();
}

function getSpecificRoom(room_id) {
    console.log('roomid', room_id)
    const params = {
        TableName: "Rooms",
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: {
            "#id": "id"
        },
        ExpressionAttributeValues: {
            ":id": room_id
        }
    };

    return ddb.query(params).promise();
}

function bookRoomToDynamo(reservation, dateFrom, dateTo) {
    const params = {
        TableName: 'Reservations',
        Item: {
            id: AWS.util.uuid.v4(),
            hotel_id: reservation.hotel_id,
            room_id: reservation.room_id,
            client: reservation.user,
            date_from: dateFrom,
            date_to: dateTo,
            book_date: new Date().valueOf()
        }
    }
    return ddb.put(params).promise();
}
function getReservationsForSpecificUser(reservation) {
    const params = {
        TableName: "Reservations",
        KeyConditionExpression: "#client = :client",
        ExpressionAttributeNames: {
            "#client": "client"
        },
        ExpressionAttributeValues: {
            ":client": reservation.user
        },
        IndexName: 'client-index'
    };

    return ddb.query(params).promise();
}