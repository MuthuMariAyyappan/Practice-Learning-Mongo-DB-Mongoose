const mongoose = require('mongoose');


let emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/
const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: Number
})


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        get: function(value) {                            //define getters
            return value ? value.toUpperCase() : "";
        },
        // set: function(v){                              //define setters, we have properties called 
        //     this._name = v                             //applyGetter, applySetters which is boolean 
        // }                                              //that by default it true allow user to control
    },                                                    //whether want to get or set value to properties
    age: {
        type: Number,
        min: 18,
        max: 100,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        minLength: 10,
        validate: {
            validator: (value) => emailRegex.test(value),
            message: props => `${props.value} is not a valid email address`
        }
    },
    address: addressSchema,
    hobbies: [String],
    bestFriend: {      //like child table implementaion
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"   //here we will specify which model it refers to ("GIVE MODEL NAME HERE")                      
    },
    createdDate: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    modifiedDate: {
        type: Date,
        // immutable: true,
        // default: () => Date.now()
    }
});


userSchema.method.sayHi = function () {        //don't use arrow functions here because you can't use this keyword and parameter duplication is not allowed
    console.log(`Hi, this is ${this.name}`)     //this model("userSchema").method is used to create custom method for one instace 
    // it means one document
}

userSchema.statics.findByName = function (name) {         //statics straightly apply on collection
    //this model("userSchema").statics is custom method for 
    return this.where({ name: new RegExp(name, "i") })    //and have the whole collection and do work on it
}                                                       //if you give userSchema.find().findByName() will show error

userSchema.query.byName = function (name) {
    return this.where({ name: new RegExp(name, "i") })  //this is work as the querying part
    //eg: userSchema.find().byName("priya")
    //based on the find result only the query will run

}

userSchema.virtual("namedEmail").get(function () {   //only single instance(only one document don't work in array)
    //this will be used to create the new property that 
    // actually will not present in DB it only virtually present
    return `${this.name} <${this.email}>`;         //most useful method eg: namedEmail nu oru field namma document la
    //ella if atha normalla apidi oru field define panni athula data
    //store pannurathu waste of memory and data duplication so we 
    //use this virtual function for that
})

userSchema.pre("findOneAndUpdate",function(next){
    this.options.runValidator = true;
    this._update.modifiedDate = Date.now(); // Use update() instead of set() for findOneAndUpdate
    next();                                 //For updateOne use set()
})

userSchema.post("findOneAndUpdate",function(doc,next){
    console.log(`User updated at: ${doc.modifiedDate}`)
    next()
})
module.exports = mongoose.model("User", userSchema)