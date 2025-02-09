import mysql2 from 'mysql2/promise';

const userSchema = new mysql2.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minLength: [3, 'Name must be at least 3 characters long'],
        maxLength: [50, 'Name must be at most 50 characters long'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        lowercase: true,
        minLength: [5, 'Email must be at least 5 characters long'],
        maxLength: [255, 'Email must be at most 255 characters long'],
        match: [/.+@.+\..+/, 'Email must be a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at least 8 characters long'],
        }
    }, 
    {
        timestamps: true
    });
    
    export default userSchema;