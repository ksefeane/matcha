TABLES = {}

TABLES['users'] = (
		"CREATE TABLE `users` ("
		" `id` int(11) NOT NULL AUTO_INCREMENT,"
		" `username` varchar(20) NOT NULL,"
		" `email` varchar(60) NOT NULL,"
		" `password` varchar(100) NOT NULL,"
		" PRIMARY KEY (`id`)"
		") ENGINE=InnoDB")

TABLES['profiles'] = (
		"CREATE TABLE `profiles` ("
		" `user_id` int(11),"
		" `first_name` varchar(25) NOT NULL,"
		" `last_name` varchar(25) NOT NULL,"
		" `gender` varchar(25) NOT NULL,"
		" `orientation` varchar(25) NOT NULL,"
		" `preference` varchar(240) NOT NULL,"
		" `interests` varchar(200) NOT NULL,"
		" `bio` varchar(255) NOT NULL,"
		" FOREIGN KEY (`user_id`) REFERENCES users(`id`)"
		") ENGINE=InnoDB")

TABLES['images'] = (
		"CREATE TABLE `images` ("
		" `user_id` int(11),"
		" `img_src` varchar(250) NOT NULL,"
		" `profile_pic` varchar(250) NOT NULL,"
		" FOREIGN KEY (`user_id`) REFERENCES users(`id`)"
		") ENGINE=InnoDB")
