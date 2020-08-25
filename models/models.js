const Sequelize = require('sequelize')
const db = require('../connection');

const Employee = db.define("employee",
    {
        id : {
            type : Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username : {
            type : Sequelize.STRING,
            unique: true,
            allowNull : false
        },
        first_name : {
            type : Sequelize.STRING,
            allowNull : false
        },
        last_name : {
            type : Sequelize.STRING
        },
        email : {
            type : Sequelize.STRING,
            unique: true,
            allowNull : false
        },
        picture : {
            type : Sequelize.STRING,
            allowNull : false
        },
        division : {
            type : Sequelize.STRING,
            allowNull : false
        }
    },
    {
        timestamps : false
    }
);

const Address = db.define("Address",
    {
        employee_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'employees',
                key: 'id'
            } 
        },
        street : {
            type : Sequelize.STRING,
            allowNull : false
        },
        city : {
            type : Sequelize.STRING,
            allowNull : false
        },
        province : {
            type : Sequelize.STRING,
            allowNull : false
        },
        country : {
            type : Sequelize.STRING,
            allowNull : false
        },
        postal_code : {
            type : Sequelize.STRING,
            allowNull : false
        }
    },
    {
        timestamps : false
    }
);

const Phone = db.define("Phone",
    {
        employee_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'employees',
                key: 'id'
            } 
        },
        phone_type : {
            type : Sequelize.STRING,
            allowNull : false
        },
        phone_number : {
            type : Sequelize.STRING,
            allowNull : false
        }
    },
    {
        timestamps : false
    }
);

Employee.hasOne(Phone,{
    onDelete : "cascade",
    foreignKey: 'employee_id', 
    foreignKeyConstraint: true
     
});

Employee.hasOne(Address,{

    onDelete : "cascade",
    foreignKey: 'employee_id', 
    foreignKeyConstraint: true
}); 


module.exports = {
    employee: Employee,
    address: Address,
    phone : Phone
};