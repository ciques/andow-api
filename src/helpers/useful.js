const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createToken = (userId) => {
    var token = jwt.sign({ data: userId }, process.env.JWT_SECRET);
    return token;
}

// Get session ID on token
const getUserIdInToken = (token) => {
    var result = '';
    try {
        result = jwt.verify(token, process.env.JWT_SECRET).data;
    }
    catch (err) { }

    return result;
}

const getHashedPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
    })
}

const comparePassword = (password, hashPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashPassword, function (err, result) {
            if (err) {
                reject(err);
            } else if (result) {
                resolve(result);
            } else {
                reject(result)
            }
        });
    })
}

const storeImage = (password, hashPassword) => {

}



module.exports = {
    getHashedPassword: getHashedPassword,
    comparePassword: comparePassword,
};