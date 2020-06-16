const queryModel = require('./queryModel')


var loggedInUser = function(user) {
    this.username = user.username
    this.first_name = user.first_name
    this.last_name = user.last_name
    this.email = user.email
    this.password = user.password
}



loggedInUser.findSuggestions = (user, callback) => {

    queryModel.fetchGenericSugestions(user,  (err, res) => {
            if (res) {
            callback(null, res);
        } else {
            callback('error found', null);
        }
    });
};

module.exports = loggedInUser;



