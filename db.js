const {MongoClient} = require("mongodb");

let dbConnection

const connectDb =(callBackFn) => {
    return MongoClient.connect("mongodb://127.0.0.1:27017/bookStore")
                      .then((client) =>{
                         dbConnection = client.db()
                         console.log("Connected to MongoDB",dbConnection)
                         return callBackFn();
                      })
                      .catch((err) =>{
                        console.log(err)
                        return callBackFn(err)
                      })
}

const getDb = () =>{
    console.log("getdb",dbConnection)
    return dbConnection
}

module.exports = {
    connectDb,
    getDb
}