import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String, 
        required: true
    }, 
    username: {
        type: String, 
        required: true, 
        index: {
            unique: true, 
            dropDups: true
        }
    }, 
    email: {
        type: String, 
        required: true, 
        index: {
            unique: true, 
            dropDups: true
        }
    }, 
    password: {
        type: String, 
        required: true
    }, 
    date: {
        type: Date, 
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

export default User;