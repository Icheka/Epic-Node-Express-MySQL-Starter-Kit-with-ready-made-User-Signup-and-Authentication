const _handler = require("../_handlers/index");
const Person = require("./Person.abstract.controller");
const User_model = require('../models/User_model');
const HttpClass = require("../utils/Http.class");

// _handler._check schemas
const X_schemas = require("../_handlers/schema");
const { X_signup, X_signin } = X_schemas;
class User extends Person {

    find(param, value) {
        return User_model.find(param, value, "user");
    }

    verifyEmail(email) {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return regex.test(email);
    }

    verifyPhoneNumber(number) {
        const regex = /^\+/;
        try {
            parseInt(number);
        } catch (err) {
            return false;
        }
        return regex.test(number);
    }

    async handleGeneratingUserID() {
        const id = _handler.generateRandomID(20);
        const possible_users = await this.find("user_id", id);
        if (possible_users.length > 0) return this.handleGeneratingUserID();
        return id;
    }

    getCurrentTimeStamp() {
        return new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    // =======================
    //         PUBLIC 
    // =======================

    async signup(obj) {
        /*
        1. Test with _check
        2. Check if email is valid
        3. Check if email exists
        4. Encrypt password
        5. Generate user_id
        6. Insert
        */

        const Http = new HttpClass();
        // >>> {1}
        let result = _handler._validate(X_signup, obj);
        if (result['bool'] !== true) {
            // return [406, null, result];
            return [406, null, "Some parameters were unacceptable. Check that your params are up to the required lengths and are names appropriately"];
        } else {
            obj = _handler.rearrangeRequestObject(X_signup, obj);
            // checks confirmed. Can continue with normal program flow.
            // {2}
            if (this.verifyEmail(obj.email) == false) return [406, "Invalid Email", "Invalid email supplied"];
            if (this.verifyPhoneNumber(obj.phone_number) == false) return [406, "Invalid Phone Number", "Invalid phone number supplied"];
            if (this.verifyEmail(obj.nok_email) == false) return [406, "Invalid Email", "Invalid email supplied for Next-Of-Kin"];
            if (this.verifyPhoneNumber(obj.phone_number) == false) return [406, "Invalid Phone Number", "Invalid phone number supplied for Next-Of-Kin"];

            // >>> {3}
            let possible_emails = await this.find("email", obj.email);
            if (possible_emails.length > 0) {
                // email found in database
                return [409, null, "An account associated with this email already exists."];
            } else {
                // >>> {4}
                obj.password = await _handler.hash(obj.password);
                // >>> {5}
                obj.user_id = await this.handleGeneratingUserID();
                // >>> {6}
                obj.pass = obj.password;
                delete obj.password;
                obj.created_at = this.getCurrentTimeStamp();
                result = User_model.signup(obj);
                return [200, null, "Account created successfully!", obj];
            }

        }
    } // end of signup()

    async signin(obj) {
        /*
        1. Test with _validate
        2. Return appropriate message if check == fail
        3. Find user by email: return 404 if user == null
        4. Compare passwords: return 
        */
        // {1}
       let validation_result = _handler._validate(X_signin, obj);

        if (validation_result['bool'] !== true) {
           if (validation_result['code'] == 0) {
                return [406, null, "The request body does not match the expected object. Check parameter names, request object length."];
            } else if (validation_result['code'] == 1) {
               return [400, null, "The request body lacks one or more required parameters or one or more parameters have been passed in an unacceptable format."];
           }
        } else {
            obj = _handler.rearrangeRequestObject(X_signin, obj);
            // {3}
            let user = await this.find("email", obj.email);
            if (user.length == 0) {
                // user not found
                return [404, null, "No user with that email address was found."];
            } else {
                // {4}
                let password_compare_result = await _handler.compare_passwords(obj.password, user[0].pass);
                if (password_compare_result == false) {
                    // password failed verification
                    return [401, "Unauthorized: Invalid Password", "Invalid password"];
                } else {
                    // password passed verification
                    return [200, null, "Authorized: User account authenticated", { email: obj.email, bearer: user[0].pass }];
                }
            }

       }


        return [200, null, "Good boy!", obj];
    }
}

module.exports = new User();