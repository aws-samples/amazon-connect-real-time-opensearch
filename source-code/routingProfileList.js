const { ConnectClient, ListRoutingProfilesCommand } = require("@aws-sdk/client-connect");

const region = process.env.AWS_REGION;

const routingProfileList = {
    async get(instanceId) {

        const client = new ConnectClient({ region: region });
    
        var response = null;
        try {
            var input = {};
            input.InstanceId = instanceId;

            const command = new ListRoutingProfilesCommand(input);

            response = await client.send(command);
        } catch (error) {
            console.error(error);
        }
        return response;
    },
    async getRoutingProfileArray(response) {
        let routingProfileArray = [];

        if(response && response.RoutingProfileSummaryList){
            for(routingProfile of response.RoutingProfileSummaryList){
                if(!routingProfileArray.includes(routingProfile.Id)){
                    routingProfileArray.push(routingProfile.Id);
                }
            }
        }
        return routingProfileArray;
    },
    async getRoutingProfileNames(response) {
        let routingProfileArray = [];
        let routingProfileNames = {};

        if(response && response.RoutingProfileSummaryList){
            for(routingProfile of response.RoutingProfileSummaryList){
                if(!routingProfileArray.includes(routingProfile.Id)){
                    routingProfileArray.push(routingProfile.Id);
                    routingProfileNames[routingProfile.Id] = routingProfile.Name;
                }
            }
        }
        return routingProfileNames;
    }        


}
module.exports = routingProfileList;