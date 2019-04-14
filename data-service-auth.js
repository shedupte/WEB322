var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;


const userSchema = new Schema({
    userName: String,
    password: String,
    email: String,
    loginHistory: [{ dateTime: Date, userAgent: String }],
});

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password'))
        return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err)
            return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err)
                return next(err);
            user.password = hash;
            next();
        });
    });
});

let User = mongoose.model('User', userSchema); //to be deined on new connection 


module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("connectionString");
        db.on('error', (err) => {
            reject(err); // reject the promise with the provided error
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        if (userData.password !== userData.password2)
            reject('Passwords do not match');
        else {
            let newUser = User(userData);
            newUser.save()
                .then(() => {
                    resolve();
                })
                .catch(err => {
                    if (err.code == 11000)
                        reject('user name already taken')
                    else if (err.code != 11000)
                        reject(`There was an error creating the user: ${err}`);
                });
        }
    });
}

module.exports.checkUser = (userData) => {
    return new Promise((resolve, reject) => {
        User.find({ userName: userData.username })
            .then(users => {
                bcrypt.compare(userData.password, user[0].password)
                    .then((res) => {
                        user[0].loginHIstory.push({ dateTime: (new Date()).toString(), userAgent: userData.userAgent });
                        User.update({ userName: users[0].userName },
                            { $set: { loginHIstory: user[0].userName } },
                            { multi: false })
                            .exec()
                            .then(() => {
                                resolve(user[0]);
                            })
                            .catch((err) => {
                                reject(`There was an error verifying the user: ${err}`);
                            });
                    })
                    .catch((err) => {
                        reject(`Incorrect Password for user: ${UserData.username}`);
                    })
            })
            .catch(err => {
                reject(`Unable to find user: ${userData.userName}`);
            })
    });
} 