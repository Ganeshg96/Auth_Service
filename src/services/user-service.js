const jwt= require('jsonwebtoken');
const bcrypt= require('bcrypt');

const UserRepository = require('../repository/user-repository');
const{JWT_KEY} = require('../config/serverConfig');
const AppErrors = require('../utils/error-handler');

class UserService{
    constructor(){
        this.userRepository= new UserRepository();
    }

    async create(data){
        try {
            const user= await this.userRepository.create(data);
            return user;
        } catch (error) {
            if(error.name =='SequelizeValidationError'){
                throw error;
            }
            console.log("something went wrong in the service layer");
            throw error;
        }
    }

    async signIn(email,plainPassword){
        try {
            // step1 --> fetch the user using the email
            const user= await this.userRepository.getByEmail(email);
            // step2 --> compare incoming plain password with stored encrypted password
            const passwordMatch = this.checkPassword(plainPassword, user.password);

            if(!passwordMatch){
                console.log("password does not match");
                throw{error:'Incorrect password'};
            }
            // step3 --> if passwords match then create a token and send it to the user
            const newJWT= this.createToken({email: user.email, id:user.id});
            return newJWT;
        } catch (error) {
            if(error.name == 'AttributeNotFound'){
                throw error;
            }
            console.log("something went wrong in the signin process");
            throw error;
        }
    }

    async isAuthenticated(token) {
        try {
            const response = this.verifyToken(token);
            if(!response) {
                throw {error: 'Invalid token'}
            }
            const user = await this.userRepository.getById(response.id);
            if(!user) {
                throw {error: 'No user with the corresponding token exists'};
            }
            return user.id;
        } catch (error) {
            console.log("Something went wrong in the auth process");
            throw error;
        }
    }

    createToken(user){
        try {
            const result= jwt.sign(user, JWT_KEY, {expiresIn: '1d'});
            return result;
        } catch (error) {
            console.log("something went wrong in the token creation");
            throw error;
        }
    }

    verifyToken(token){
        try {
            const response = jwt.verify(token,JWT_KEY);
            return response;
        } catch (error) {
            console.log("something went wrong in the token validation",error);
            throw error;
        }
    }

    checkPassword(userInputPlainPassword, encryptedPassword){
        try {
            return bcrypt.compareSync(userInputPlainPassword,encryptedPassword);
        } catch (error) {
            console.log("something went wrong in the password comparision");
            throw error;
        }
    }

    isAdmin(userId) {
        try {
            return this.userRepository.isAdmin(userId);
        } catch (error) {
            console.log("Something went wrong in service layer");
            throw error;
        }
    }

}

module.exports= UserService;