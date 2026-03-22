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
    // const newContact = await Contact({
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     email: req.body.email,
    //     phone: req.body.phone,
    //     address: req.body.address
    // });

// mongoose method if the name are same in in the form    
    const newContact = await Contact.create(req.body)
    newContact.save()
        .then(() => res.redirect('/'))
        .catch(err => console.error('Error saving contact:', err));
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