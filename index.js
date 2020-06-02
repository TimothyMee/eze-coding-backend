const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()
const config = require('./config');

let multer = require('multer');
var upload = multer({ dest: 'temp/' })
const fs = require('fs');
const excelToJson = require('convert-excel-to-json');



// const api = require('./api');


//establish db connection 
// require('./lib/db');

const app = express();

//extract env variables 
const { port } = config;

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//home request
app.get('/', (req, res) => {
    res.send('welcome delivey api');
    console.log('started');
});

app.post('/upload', [upload.single('products')], (req, res) => {
    try {
        //parsing data
        const path = fs.createReadStream(req.file.path)
        let buyPhoneNames = excelToJson({
            sourceFile: path.path,
            sheets: ['IPHONES'],
            range: 'A3:J*',
            columnToKey: {
                A: "name",
            }
        });

        let sellPhoneNames = excelToJson({
            sourceFile: path.path,
            sheets: ['IPHONES'],
            range: 'L3:U*',
            columnToKey: {
                L: "name",
            }
        });

        //filter the buy and sell PhoneNames. remove unlocked
        buyPhoneNames = buyPhoneNames["IPHONES"].filter((item) => (item.name !== 'Unlocked'));
        sellPhoneNames = sellPhoneNames["IPHONES"].filter((item) => (item.name !== 'Unlocked'));

       
        const oldBuy = excelToJson({
            sourceFile: path.path,
            sheets: ['IPHONES'],
            range: 'A3:J*',
            columnToKey: {
                B: "Storage Size",
                C: "New",
                D: "A1",
                E: "A2",
                F: "B1",
                G: "B2",
                H: "C",
                I: "C/B",
                J: "C/D",
            }
        });

        const buy = oldBuy["IPHONES"].reduce((arr, el) => {
            if(el["Storage Size"] === "Storage Size"){
                arr.push([])
            }
            else {
                arr[arr.length - 1].push({...el});
            }
            return arr;
        }, [])

        let buyPhoneTableModel = [];
       for(let i=0; i<buy.length; i++){
           const phones = buy[i]
           for(let storage of phones ){
               let grades = Object.keys(storage);
                const storage_size = storage["Storage Size"];
                grades = grades.filter((item) => (item !== 'Storage Size'));
               for(let grade of grades)
               {
                buyPhoneTableModel.push({
                        phone: buyPhoneNames[i].name,
                        storage: storage_size,
                        grade: grade,
                        price: storage[grade]

                    })
               }
           }
       }

        const oldSell = excelToJson({
            sourceFile: path.path,
            sheets: ['IPHONES'],
            range: 'L3:U*',
            columnToKey: {
                M: "Storage Size",
                N: "New",
                O: "A1",
                P: "A2",
                Q: "B1",
                R: "B2",
                S: "C",
                T: "C/B",
                U: "C/D",
            }
        });
        const sell = oldSell["IPHONES"].reduce((arr, el, index) => {
            if(el["Storage Size"] === "Storage Size"){
                arr.push([])
            }
            else {
                arr[arr.length - 1].push({...el});
            }
            return arr;
        }, [])

        let sellPhoneTableModel = [];
       for(let i=0; i<sell.length; i++){
           const phones = sell[i]
           for(let storage of phones ){
               let grades = Object.keys(storage);
                const storage_size = storage["Storage Size"];
                grades = grades.filter((item) => (item !== 'Storage Size'));
               for(let grade of grades)
               {
                sellPhoneTableModel.push({
                        phone: sellPhoneNames[i].name,
                        storage: storage_size,
                        grade: grade,
                        price: storage[grade]

                    })
               }
           }
       }



        fs.unlinkSync(req.file.path); // Empty temp folder
        return res.status(200).send({ message: 'product uploaded successfully', data: {
            buy: buyPhoneTableModel,
            sell: sellPhoneTableModel
        } });

    } catch (error) {
        // if (error.name === 'ValidationError') {
        //     console.log('error', error.errors)
        // }
        // else if (error.code === 'MissingRequiredParameter') {
        //     return Response.failure(res, { message: 'Error occured while trying to upload image', data: error }, httpStatuses.INTERNAL_SERVER_ERROR)
        // }
        // else console.log('error', error);

        return res.status(500).send({ message: 'Internal Server Error', data: error })
    }
});


// app.use('/api', api);

app.listen(port, () => {
    console.log(`listening at port ${port}`);
})