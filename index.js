require('dotenv').config();
const mongoose = require('mongoose');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


const Contact = require('./models/contact.models');



// database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.log('DB Error:', err.message);
  });



// Middleware

app.set('view engine', 'ejs');

// to get form data
app.use(express.urlencoded({ extended: true })); 

// for static files
app.use(express.static('public'));
 
// Routes

app.get('/', async (req, res) => {
 const member = await Contact.find();
//  res.json(member);
  res.render('home', { contacts: member });
});

app.get('/show-contact/:id', async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    res.render('show-contact', { contact });
});

app.get('/add-contact', (req, res) => {
    res.render('add-contact');
});

app.post('/add-contact', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address } = req.body;

    // optional fields allow, but at least 1 field required
    if (!firstName && !lastName && !email && !phone && !address) {
      return res.status(400).send(`
        <h2>Please fill at least one field</h2>
        <a href='/add-contact'>Go Back</a>
        `);
    }

    const newContact = new Contact({
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
      phone: phone || "",
      address: address || ""
    });

    await newContact.save();

    res.redirect('/');
    
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).send("Something went wrong");
  }
  return res.send("Please fill at least one field");
});



app.get('/update-contact/:id', async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    res.render('update-contact', {contact});
  
});

app.post('/update-contact/:id', async (req, res) => {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body);
    await contact.save();
    res.redirect('/');
});  

app.get('/delete-contact/:id', async (req, res) => {
    await Contact.findByIdAndDelete(req.params.id);
    res.redirect('/');
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});  