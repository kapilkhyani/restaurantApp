// dependencies
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectID;

const URI_TO_CONNECT_MONGODB =  "mongodb+srv://kapil:khyani@cluster0.t4t7t.mongodb.net/allapps?retryWrites=true&w=majority";
// const URI_TO_CONNECT_MONGODB = "mongodb://localhost:27017/allapps";
const DB_NAME = "allapps";
const COLLECTION_RESTAURANTS = "restaurants";

// this function will connect db and based on API send response
let connectDbAndRunQueries = async (apiName, req, res) => {
  try {
    let client = await MongoClient.connect(URI_TO_CONNECT_MONGODB);
    // select the db, Collections are selected based on needs
    const db = client.db(DB_NAME);

    // default output
    const output = { message: "SUCCESS" };

    // perform several db actions based on API names
    chooseApiAndSendResponse(apiName, db, req, res, client, output);
  } catch (err) {
    console.log("Some Error occurred ...", err);
  }
};

// choose the particular function for an API and process it
let chooseApiAndSendResponse = (apiName, db, req, res, client, output) => {
  // perform db specific ops based on API names
  switch (apiName) {
    case "getRestaurants":
      makeGetRestaurants(db, req, res, client, output);
      break;
  }
};

let makeGetRestaurants = async (db, req, res, client, output) => {
  console.log("query parameters", req.params.item);
  let { item } = req.params;
  let { body } = req;
  let query = {};
  let skip = 0;
  if (item) {
    // if searched from the search box
    query = {
      $or: [
        { name: { $regex: `${item}`, $options: "i" } },
        { locality: { $regex: `${item}`, $options: "i" } },
        { address: { $regex: `${item}`, $options: "i" } },
        { cuisines: { $elemMatch: { $regex: `${item}`, $options: "i" } } },
      ],
    };
  } else if (body) {
    // if clicked from the list of restaurants

    let keys = Object.keys(body);
    console.log("body of the req is", body, " having keys ", keys);
    keys.forEach((key) => {
      console.log("Key and its value :", key, body[key]);
      if (key !== 'page') {
        query[key] =
          key == "cost"
            ? parseInt(body[key])
            : { $regex: `${body[key]}`, $options: "i" };
      }
      if (key === 'page') {
        skip = body[key]*20;
      }
    });
  }
  console.log("Query is now\n", JSON.stringify(query, null, "\t"));
  try {
    // db call
    let data = await db
      .collection(COLLECTION_RESTAURANTS)
      .find(query)
      .skip(skip)
      .limit(50)
      .sort({ rating: -1 })
      .toArray();

    let count = await db
      .collection(COLLECTION_RESTAURANTS)
      .find(query)
      .count()
    output = data.length > 0 ? [...data] : [];
    FinalOutput = [output,count];
    sendOutputAndCloseConnection(client, FinalOutput, res);
  } catch (error) {
    console.log("unable to get all the users", error);
    sendOutputAndCloseConnection(client, output, res);
  }
};

// send the response and close the db connection
function sendOutputAndCloseConnection(client, output, res) {
  if (output && res) {
    res.json(output);
  }

  // close the database connection after sending the response
  client.close();
}

// exports
module.exports = {
  connectDbAndRunQueries,
};
