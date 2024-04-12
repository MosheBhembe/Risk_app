// server
const express = require('express');
const mongoose = require('mongoose');

const app = express()
const port = 5000;

mongoose.connect('mongodb://127.0.0.1:27017/risk');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});
// 

// Mongoose Schemas 
const { Schema } = mongoose;

const registrationSchema = new mongoose.Schema({
    id: mongoose.SchemaTypes.ObjectId,
    name: String,
    surname: String,
    age: Number,
    email: { type: String, unique: true },
    password: { type: String, unique: true },
});

const imageSchema = new mongoose.Schema({
    id: { type: String, required: true },
    filename: { type: String, required: true },
    content: { type: String, required: true }
})

const reportFormSchema = new mongoose.Schema({
    id: mongoose.SchemaTypes.ObjectId,
    Name: String,
    scene: String,
    email: { type: String, unique: true },
    description: String,
    location: String,
    assets: String,
});

const nearHitSchema = new mongoose.Schema({
    id: mongoose.SchemaTypes.ObjectId,
    incidentLocation: {
        Street: String,
        streetNumber: Number,
        Provice: String,
    },
    Description: String,
    DateTime: Date
});

const fuelConsumptionSchema = new mongoose.Schema({
    id: mongoose.SchemaTypes.ObjectId,
    regNumber: Number,
    Amount: Number,
    Costs: Number,
    DateTime: Date,
    Image: imageSchema,
    location: String,
});

const tyreChangeSchema = new Schema({
    id: mongoose.SchemaTypes.ObjectId,
    registrationNumber: Number,
    location: String,
    DateTime: Number,
});


const mechanicalFailureSchema = new Schema({
    id: mongoose.SchemaTypes.ObjectId,
    enginePart: String,
    BreakPads: String,
    description: String,
    description: String,
    carRegNumber: Number,
    DateTime: Date
});


const Registration = mongoose.model('Registration', registrationSchema);
const Report = mongoose.model('Report', reportFormSchema);
const hit = mongoose.model('Near Hit', nearHitSchema);
const Feul = mongoose.model('Feul', fuelConsumptionSchema);
const Change = mongoose.model('Change', tyreChangeSchema);
const Mechanical = mongoose.model('Mechanical', mechanicalFailureSchema);

//Middleware to parse JSON request 
app.use(express.json());

//Routes.  
app.post('/savedData/:id', async (req, res) => {
    try {
        const schemaType = req.params.id;
        let model;
        switch (schemaType) {
            case 'registration':
                model = Registration;
                break;
            case 'report':
                model = Report;
                break;
            case 'Near-Hit':
                model = hit;
                break;
            case 'feul':
                model = Feul;
                break;
            case 'tyre-change':
                model = Change;
                break;
            case 'mechanical-failure':
                model = Mechanical;
                break;
            default:
                res.status(400).send(`Invalid. Failed to load ${schemaType}`);
        }

        const newReport = new model(req.body);
        await newReport.save();
        res.send('Data Saved Successfully');

    } catch (error) {
        console.error(`Error Saving ${schemaType}`, error);
        res.status(500).send(`Server failed to save ${schemaType}`)
    }
});


app.get('/fetch/:id', async (req, res) => {
    try {
        const schemaType = req.params.id;
        let model;
        switch (schemaType) {
            case 'registration':
                model = Registration;
                break;
            case 'report':
                model = Report;
                break;
            case 'Near-Hit':
                model = hit;
                break;
            case 'feul':
                model = Feul;
                break;
            case 'tyre-change':
                model = Change;
                break;
            case 'mechanical-failure':
                model = Mechanical;
                break;
            default:
                res.status(400).send(`Invalid. Failed to load ${schematype}`)

                const data = await model.find();
                res.send(json(data));
        }
    } catch (error) {
        console.error(`Error Fetching Data from ${schemaType}`);
        res.status(500).send(`Server Failed tp fetch ${schemaType}`)
    }
});

process.on('Terminate', () => {
    db.close(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
    });
});

//start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
