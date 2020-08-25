const express = require('express');
const bodyParser = require('body-parser');
const {employee, address, phone} = require('./models/models.js');

var urlencodedParser = bodyParser.urlencoded({extended: false});
var fileUploader = require('express-fileupload');

var app = express();

app.set('view engine', 'ejs');
app.use(fileUploader())
app.use(bodyParser.json());
app.use('/assets', express.static('assets'));
app.use('/uploads', express.static('uploads'));

//WEBPAGE
app.get('/', async function(req, res)
{
    const employeedata = await employee.findAndCountAll({});
    const countEmployee = employeedata.count

    const countFrontEnd= await employee.count({ where: { division: "Front-End" }});
    const countBackEnd= await employee.count({ where: { division: "Back-End" }});
    const countFullStack= await employee.count({ where: { division: "Full-Stack" }});

    res.render('dashboard', {
        countEmployee : countEmployee,
        countFrontEnd : countFrontEnd,
        countBackEnd : countBackEnd,
        countFullStack : countFullStack   
    });
});

app.get('/employee_list', async function(req, res)
{
    const getAllEmployee = await employee.findAll({
        include : [address,phone]
    });
    res.render('employee_list', {data : getAllEmployee});
});

app.get('/add_employee', async function(req, res)
{
    const getAllEmployee = await employee.findAll({
        include : [address,phone]
    });
    res.render('add_employee', {data : getAllEmployee});   
});

//API
app.get('/api/getAllEmployees', async function(req,res){
    try{
        const getAllEmployee = await employee.findAll({
            include : [address,phone]
        });
        res.json(getAllEmployee);
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send('error');
    }
});


app.get('/api/getAnEmployee', async function(req,res){
    try{
        const id = req.body.id
        const getAnEmployee = await employee.findOne({
            where : {id : id}
        });
        res.json(getAnEmployee);
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send('error');
    }
});

app.post('/api/employee',urlencodedParser,async function(req,res) {
    try
    {
        const {username, first_name, last_name, email, division, street, city, province, country, postal_code} = req.body;
        const picture = username+"_" + req.files.picture.name;
        const pictureFile = req.files.picture;
        const newEmployee = new employee({
            username,first_name,last_name,email, picture, division
        });

        await newEmployee.save();

        const employee_id = newEmployee.id
      
        const newAddress = new address({
            employee_id, street, city, province, country, postal_code
        });

        await newAddress.save();

        const {phone_number, phone_type} = req.body;
        const newPhone = new phone({
            employee_id , phone_number,phone_type
        });
        
        await newPhone.save();

        pictureFile.mv('./uploads/' + picture, function(err,result){
            if(err)
            {
                console.error(err.message);
            }
            res.redirect('/employee_list');
        })
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send('error');
    }
});


app.post('/api/updateEmployee', urlencodedParser, async function(req,res){
    try
    {
        const {id, username, first_name, last_name, email, division, street, city, province, country, postal_code} = req.body;
        const picture = username+"_" + req.files.picture.name;
        const pictureFile = req.files.picture;
        const updateEmployee = await employee.update({
            username,first_name, last_name,email, picture, division
        }, {where : {id : id}});

        await updateEmployee;

        const employee_id = id
        const updateAddress = await address.update({
            employee_id, street, city, province, country, postal_code
        }, {where : {employee_id : employee_id}});

        await updateAddress;

        const {phone_number, phone_type} = req.body;
        const updatePhone = await phone.update({
            employee_id , phone_number,phone_type
        }, {where : {employee_id : employee_id}});
        
        await updatePhone;

        pictureFile.mv('./uploads/' + picture, function(err,result){
            if(err)
            {
                console.error(err.message);
            }
            res.redirect('/employee_list');
        })  
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send('error');
    }
})

app.post('/api/deleteAnEmployee', urlencodedParser, async function(req,res){
    try{
        const username = req.body.username;
        const deleteEmployee = await employee.destroy({
            where : {username : username}
        });

        await deleteEmployee;
        res.redirect('/employee_list');
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send('error');
    }  
})

app.listen(3000);