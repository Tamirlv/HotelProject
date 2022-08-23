export type AmplifyDependentResourcesAttributes = {
    "function": {
        "hotelFunction": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "roomFunction": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "reservationFunction": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "api": {
        "Hotel": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    }
}