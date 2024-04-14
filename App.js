const express = require("express")
const { connectDb, getDb } = require("./db")
const { ObjectId } = require("mongodb")
const app = express()

let db;
connectDb((err) => {
    if (!err) {
        app.listen(7001, () => {
            console.log("APP LISTENING IN 7001 AND DB CONNECTED")
        })
        db = getDb()
        console.log("DB CONNECTED", db)
    }
})


app.get("/books", async (req, res) => {  
    try { 
        let page = parseInt(req.query?.page === "0" ? "1" : req.query?.page) - 1   //my page number starts from 1 so I externally minus one
        let contentSize = parseInt(req.query?.contentSize)
        let sort = req.query?.sort?.toLowerCase() === "desc" ? {"_id": -1} : {"_id": 1}
            
      console.log("page",page)
        // const books = await db.collection("books").find({'title':"The Remains of the Day"}).toArray();
        let books = []
        await db.collection("books").find()
        .skip(page  * contentSize)
        .limit(contentSize)
        .sort(sort)
        .forEach(element => {
            books.push(element)
            
        });
        console.log("books",books,books.length)
        res.send(books);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching books");
    }
})

//find single book by id
app.get("/books/:id", (req, res) => {
    const id = req.params.id
    if (ObjectId.isValid(id)) {
        db.collection("books").findOne({ "_id": new ObjectId(req.params.id) })
            .then((data) => {
                if (data) {
                    res.status(200).send(data)
                }
                else {
                    res.status(409).send(`No Book with ID ${req.params.id}`)
                }
            })
            .catch((err) => {
                res.status(500).send({ 'Server Error': err })
            })
    }
    else {
        res.status(400).send("Invalid ID passed ")
    }
})

//create a new book
app.post("/create-book", express.json(), (req, res) => {
    let data = req.body
    if (data) {
        db.collection("books").insertOne(data)
            .then((data) => {
                res.status(200).send(data)
            })
            .catch((err) => {
                res.status(500).send(err)
            })

    }
})

app.delete("/books/:id",(req,res) =>{
    const id = req.params.id
    if(ObjectId.isValid(id)){
        db.collection("books").deleteOne({"_id": new ObjectId(id)})
          .then((data)=>{
            if(data?.deletedCount > 0){
                console.log(data);
                console.log(`Deleted the book with the id:${id}`);
                res.status(200).redirect("/books") 
            }
            else{
                res.status(409).send("The Requested Id is not present")
            }
             
          })
          .catch(err =>{
            res.status(500).send(err);
          })
    }
    else{
        res.status(400).send("Invalid ID passed")
    }
})

//update the given field by patch operation
app.patch("/books/:id",express.json(),(req,res) =>{
    const updateData = req.body
    const id = req.params.id
    if(ObjectId.isValid(id)){
        db.collection("books").updateOne({"_id": new ObjectId(id)},{"$set": updateData})
        .then((data) =>{
            
                res.status(200).send(data)
           
        })
        .catch(err =>{
            res.status(500).send(err)
        }) 
    }
    else{
        res.status(400).send("Invalid ID passed")
    }
})