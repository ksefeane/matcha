TABLES = {}

TABLES['users'] = (
		"CREATE TABLE `users` ("
		" `id` int(11) NOT NULL AUTO_INCREMENT,"
		" `username` varchar(20) NOT NULL,"
		" `email` varchar(60) NOT NULL,"
		" PRIMARY KEY (`id`)"
		") ENGINE=InnoDB")
