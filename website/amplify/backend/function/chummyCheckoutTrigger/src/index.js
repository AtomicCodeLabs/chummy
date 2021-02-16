/* Amplify Params - DO NOT EDIT
	API_CHUMMY_GRAPHQLAPIENDPOINTOUTPUT
	API_CHUMMY_GRAPHQLAPIIDOUTPUT
	API_CHUMMY_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

// Function resolvers
// Multiple methods can be called in this lambda trigger
const resolvers = {
  Mutation: {
    cancelSubscription: (event) => {
      return cancelSubscription(event);
    },
    syncUser: (event) => {
      return syncUser(event);
    }
  }
};

async function cancelSubscription(event) {
  console.log('CANCEL SUBSCRIPTION', event);
}

async function syncUser(event) {
  console.log('SYNC USER', event);
}

/**
 * Processes a Stripe event triggered from the client
 * @param {*} event
 */
exports.handler = async (event, context) => {
  console.log('Event', event);
  console.log('Context', context);

  const typeHandler = resolvers[event.typeName];
  if (typeHandler) {
    const resolver = typeHandler[event.fieldName];
    if (resolver) {
      return await resolver(event);
    }
  }
  throw new Error('Resolver not found.');
};
