const Profile = require('../models/profileModel');
const Q = require('../models/queryModel');
const params = ['age', 'gender', 'orientation', 'preference', 'interests', 'location', 'bio'];
const upload = require('../models/imageModel');
const fs = require('fs');
const dir = 'public/uploads/temp';
const suggestions = require('../models/suggestionsModel')

exports.formProfile = (req, res) => {
	var token = req.session.token;
	if (token)
		Q.fetchone("profiles", params, 'username', req.session.user, (err, result) => { 
			if (result.length > 0)
				var p = result[0];
			else
				var p = [];
			res.render('profileForm', {
				token: token,
				age: p.age,
				gender: p.gender,
				orientation: p.orientation,
				preference: p.preference,
				interests: p.interests,
				locate: p.location,
				bio: p.bio
			})
		});
	else
		res.redirect('/login')
};

exports.userProfile =  (req, res) => {
	var token = req.session.token;
	if (token) {
		// suggestions.fetchSuggestions();
		suggestions.findSuggestions(req.session.user, (err, result) => {
			if ( err) {
				console.log('not found')
			} else {
				res.render('profile', {
					token: token,
					items: result })
			}
		});

	}
	else{
		res.redirect('/login')
	}

};

exports.registerProfile = (req, res, next) => {
	var sess = req.session;
	Q.fetchone("tokens", ['username'], 'token', sess.token, (err, result) => {
		if (result.length > 0) {
			var newProfile = new Profile(result[0].username, req.body);
			Profile.validate(newProfile, (err, success) => {
				if (err)
					console.log("error ", err);
				else {
					Profile.register(result[0].username, req.body.password, newProfile, (err, success) => {
						if (err)
							console.log('failed to update profile');
						else {
							console.log('profile updated');
							res.redirect('/p/upload')
						}
					})
				}
			})
		}
		else {
			console.log("please log in to register");
			res.redirect('/login')
		}
	})
};

exports.formPhotos = (req, res) => {
	var token = req.session.token;
	res.render('uploadForm', {token: token})
};

exports.uploadPhotos = (req, res) => {
	var files = req.files;
	var sess = req.session;
	if (!files)
		res.send('error please upload');
	else {
		fs.readdir(dir, (err, files) => {
			if (err)
				console.log(dir);
			else {
				var temp = [];
				for (let i in files) {
					var f = `/^[${req.session.user}]/`;
					if (files[i].match(f)) {
						temp.push(files[i])
					}
				}
				console.log('upload successful');
				res.redirect('/p/u')
			}
		})
	}
};
