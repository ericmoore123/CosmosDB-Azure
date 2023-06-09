//@ts-check
const CosmosClient = require('@azure/cosmos').CosmosClient

const config = require('./config/config')
const url = require('url')

const endpoint = config.endpoint
const key = config.key

const databaseId = config.database.id
const containerId = config.container.id
const partitionKey = { kind: 'Hash', paths: ['/partitionKey'] }

const options = {
    endpoint: endpoint,
    key: key,
    userAgentSuffix: 'CosmosDBJavascriptQuickstart'
};

// @ts-ignore
const client = new CosmosClient(options);

/**
 * Create the database if it does not exist
 */
async function createDatabase() {
    const { database } = await client.databases.createIfNotExists({
        id: databaseId
    })
    console.log(`Created database:\n${database.id}\n`)
}

/**
 * Read the database definition
 */
async function readDatabase(client) {
    const { resource: databaseDefinition } = await client
        .database(databaseId)
        .read()
    console.log(`Reading database:\n${databaseDefinition.id}\n`)
}

/**
 * Create the container if it does not exist
 */
async function createContainer() {
    const { container } = await client
        .database(databaseId)
        .containers.createIfNotExists({ id: containerId, partitionKey })
    console.log(`Created container:\n${config.container.id}\n`)
}

/**
 * Read the container definition
 */
async function readContainer(client) {
    const { resource: containerDefinition } = await client
        .database(databaseId)
        .container(containerId)
        .read()
    console.log(`Reading container:\n${containerDefinition.id}\n`)
}

/**
 * Scale a container
 * You can scale the throughput (RU/s) of your container up and down to meet the needs of the workload. Learn more: https://aka.ms/cosmos-request-units
 */
async function scaleContainer(client) {
    const { resource: containerDefinition } = await client
        .database(databaseId)
        .container(containerId)
        .read();

    try {
        const { resources: offers } = await client.offers.readAll().fetchAll();

        const newRups = 500;
        for (let offer of offers) {
            if (containerDefinition._rid !== offer.offerResourceId) {
                continue;
            }
            offer.content.offerThroughput = newRups;
            const offerToReplace = client.offer(offer.id);
            await offerToReplace.replace(offer);
            console.log(`Updated offer to ${newRups} RU/s\n`);
            break;
        }
    } catch (err) {
        if (err.code == 400) {
            console.log(`Cannot read container throuthput.\n`);
            console.log(err.body.message);
        } else {
            throw err;
        }
    }
}

/**
 * Create user if it does not exist
 */
async function createUser(userBody) {
    const { item } = await client
        .database(databaseId)
        .container(containerId)
        .items.upsert(userBody)
    console.log(`Created family item with id:\n${userBody.id}\n`)
}

/**
 * Query the container using SQL
 */
async function queryContainer(userId) {
    console.log(`Querying container: ${config.container.id}`);

    const querySpec = {
        // query: 'SELECT * FROM root r WHERE r.fName = @userFName AND r.id = @userId',
        // query: 'SELECT * FROM root r WHERE r.id = @userId',
        query: 'SELECT top 1 * FROM root order by root._ts desc',
        // "parameters": [
        //     { "name": "@userFName", "value": fname },
        // { "name": "@userId", "value": userId }
        // ]
    }

    const { resources } = await client
        .database(databaseId)
        .container(containerId)
        .items.query(querySpec)
        .fetchAll()

    return resources[0];
    // for (let queryResult of results) {
    //     let resultString = JSON.stringify(queryResult)
    //     console.log(`\tQuery returned ${resultString}\n`)
    // }
}

/**
 * Replace the user by ID.
 */
async function replaceUser(userBody) {
    console.log(`Replacing User:\n${userBody.id}\n`)
        // Change property 'grade'
    userBody.employment = {
        "status": "Full-time, Permanent",
        "role": "Developer",
        "employer": "FINTRAC, GOC"
    };
    const { item } = await client
        .database(databaseId)
        .container(containerId)
        .item(userBody.id)
        .replace(userBody)
}

/**
 * Delete the item by ID.
 */
async function deleteUser(userBody) {
    await client
        .database(databaseId)
        .container(containerId)
        .item(userBody.id)
        .delete(userBody)
    console.log(`Deleted User:\n${userBody.id}\n`)
}

/**
 * Cleanup the database and collection on completion
 */
async function cleanup() {
    await client.database(databaseId).delete()
}

/**
 * Exit the app with a prompt
 * @param {string} message - The message to display
 */
function exit(message) {
    console.log(message)
    console.log('Press any key to exit')
    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.on('data', process.exit.bind(process, 0))
}

// createDatabase()
//   .then(() => readDatabase(client))
//   // .then(() => createContainer())
//   .then(() => readContainer(client))
//   // .then(() => scaleContainer(client))
//   .then(() => createUser(config.items.Eric))
//   .then(() => queryContainer())
//   // .then(() => deleteUser(config.items.Tom))
//   // .then(() => replaceUser(config.items.Eric))

//   .then(() => {
//     exit(`Completed successfully`)
//   })
//   .catch(error => {
//     exit(`Completed with error ${JSON.stringify(error)}`)
//   })

module.exports = {
    createUser,
    queryContainer,
}