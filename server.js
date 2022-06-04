const dbConnect = require('./mongodb')
const { urlencoded } = require('express');
const path = require('path');
const express = require('express')
const app = express();
const jwt = require('jsonwebtoken');
const { redirect } = require('express/lib/response');
const file = require('./file');
const user = require('./schema/user-schema')



const main = async() => {
    let data = await dbConnect();
    data = await data.find().toArray();
    console.log(data);
}



const port = process.env.Port || 4000;
app.use(express.urlencoded({ extended: false }))

// users.find({ emial: user.email })
// const users = [];

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs');
})

//LOGIN
app.get('/login', (req, res) => {
    res.render('login.ejs');
})
app.post('/login', (req, res) => {
        const Email = req.body.email;
        const pw = req.body.password;

        const db = dbConnect.getDb();
        const user = db.user1;
        db.collection('user1').find({ EmailAddress: Email })
            .toArray().then(user1 => {
                if (user1[0].EmailAddress === Email) {
                    if (user1[0].Password === pw) {
                        res.render('adminHome.ejs');

                    } else {
                        res.json({ message: 'Incorrect Password' });
                    }
                } else {
                    res.json({ message: 'Incorrect Username or Password' });
                }

            })
    })
    // ADD NEW USER
app.get('/addNewUser', (req, res) => {
    res.render('addNewUser.ejs');
})
app.post('/addNewUser', async(req, res) => {
    // try {
    //     const HashedPassword = await bcrypt.hash(req.body.password, 10);
    //     users.push({
    //         id: Date.now().toString(),
    //         fname: req.body.fname,
    //         lname: req.body.lname,
    //         email: req.body.email,
    //         password: HashedPassword,
    //         role: req.body.role
    //     })
    //     res.redirect('/adminHome')
    // } catch {
    //     res.redirect('/addNewUser');
    // }
    // console.log(users);
    const name1 = req.body.fname;
    const name2 = req.body.lname;
    const emaila = req.body.email;
    const pw = req.body.password;
    const db = dbConnect.getDb();
    //db.collection('user1').insertOne({ Firstname: name1, Lastname: name2, EmailAddress: emaila, Password: pw });
    res.json({ message: 'Success' });
})


//ADMIN  HOME
app.get('/adminHome', (req, res) => {
    res.render('adminHome.ejs');
})
app.post('/adminHome', (req, res) => {

    if (req.body.hidden == 'addNewUser') {
        res.render('addNewUser.ejs');
    }
    if (req.body.hidden == 'addNewAccount') {
        res.render('addNewAccount.ejs');
    }
    if (req.body.hidden == 'withdrawMoney') {
        res.render('withdrawMoney.ejs');
    }
    if (req.body.hidden == 'depositMoney') {
        res.render('depositMoney.ejs');
    }
    if (req.body.hidden == 'transferMoney') {
        res.render('transferMoney.ejs');
    }
    if (req.body.hidden == 'logout') {
        res.render('login.ejs');
    }
})

//ADD NEW ACCOUNT
app.get('/addNewAccount', (req, res) => {
    res.render('addNewAccount.ejs');
})
app.post('/addNewAccount', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const cnic = req.body.cnic;
    const amount = 0;
    const db = dbConnect.getDb();
    db.collection('user').insertOne({ accountno: Date.now().toString(), name: name, email: email, phone: phone, cnic: cnic, amount: amount })
        // .then((user) => {
        //     console.log(user.insertedId.toString());
        //     res.json({ message: 'Success' })
        // });

    // const db = dbConnect.getDb();
    // const newUser = db.collection('user').find({ email: 'mahadbinnaeem05@gmail.com' });

    // console.log(newUser);

    res.json({ message: 'Success' })
})

//DEPOSIT MONEY
app.get('/depositMoney', (req, res) => {
    res.render('depositMoney.ejs');

})
app.post('/depositMoney', (req, res) => {
    const accno = req.body.account;
    const am = Number(req.body.amount);
    const db = dbConnect.getDb();
    db.collection('user').updateOne({ accountno: accno }, { $inc: { amount: am } })
        .then((user) => {
            res.json(user);
        });

})

//WITHDRAW MONEY
app.get('/withdrawMoney', (req, res) => {
    res.render('withdrawMoney.ejs');

})
app.post('/withdrawMoney', (req, res) => {
    const accno = req.body.account;
    const am = Number(req.body.amount);
    const db = dbConnect.getDb();
    db.collection('user').find({ accountno: accno })
        .toArray().then(user => {
            if (user[0].amount >= am) {
                const fm = Number('-' + am);
                db.collection('user').updateOne({ accountno: accno }, { $inc: { amount: fm } })
                res.json({ message: 'Withdrawal successful' })
            } else {
                res.json({ message: 'Not Enough Funds' });
            }
        })

})

//TRANSFER MONEY
app.get('/transferMoney', (req, res) => {
    res.render('transfertMoney.ejs');

})
app.post('/transferMoney', (req, res) => {
    const senderaccno = req.body.senderAccount;
    const receiveraccno = req.body.receiverAccount;
    const sam = Number(req.body.amount);
    const ram = Number(req.body.amount);
    const db = dbConnect.getDb();
    db.collection('user').find({ accountno: senderaccno })
        .toArray().then(user => {
            if (user[0].amount >= ram) {
                const fm = Number('-' + ram);
                db.collection('user').updateOne({ accountno: senderaccno }, { $inc: { amount: fm } })
                db.collection('user').updateOne({ accountno: receiveraccno }, { $inc: { amount: sam } })
                res.json({ message: 'Money Transfered' });
            } else {
                res.json({ message: 'Not Enough Funds' });
            }
        })
})



dbConnect.mongoConnect(() => {
    app.listen(port, () => {
        console.log(`Server connected to port ${port}`);
    })
})