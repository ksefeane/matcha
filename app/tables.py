TABLES = {}

TABLES['users'] = (
		"CREATE TABLE `users` ("
		" `id` int(11) NOT NULL AUTO_INCREMENT,"
		" `username` varchar(20) NOT NULL,"
		" `email` varchar(60) NOT NULL,"
		" `password` varchar(100) NOT NULL,"
		" `verified` bit NOT NULL DEFAULT 0,"
		" PRIMARY KEY (`id`)"
		") ENGINE=InnoDB")

TABLES['profiles'] = (
		"CREATE TABLE `profiles` ("
		" `id` int(11) NOT NULL AUTO_INCREMENT,"
		" `user_id` int(11),"
		" `first_name` varchar(25) NOT NULL,"
		" `last_name` varchar(25) NOT NULL,"
		" `gender` varchar(25) NOT NULL,"
		" `orientation` varchar(25) NOT NULL,"
		" `preference` varchar(240) NOT NULL,"
		" `interests` varchar(200) NOT NULL,"
		" `bio` varchar(255),"
		" FOREIGN KEY (`user_id`) REFERENCES users(`id`)"
		") ENGINE=InnoDB")

TABLES['images'] = (
		"CREATE TABLE `images` ("
		" `id` int(11) NOT NULL AUTO_INCREMENT,"
		" `user_id` int(11),"
		" `img_src` varchar(250) NOT NULL,"
		" `pro_pic` varchar(250) NOT NULL,"
		" FOREIGN KEY (`user_id`) REFERENCES users(`id`)"
		") ENGINE=InnoDB")

TABLES['tokens'] = (
		"CREATE TABLE `tokens` ("
		" `id` int(11) NOT NULL AUTO_INCREMENT,"
		" `user_id` int(11),"
		" `token` varchar(100) NOT NULL,"
		" FOREIGN KEY (`user_id`) REFERENCES users(`id`)"
		") ENGINE=InnoDB")
