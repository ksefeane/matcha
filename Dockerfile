FROM alpine
RUN apk update && apk add zsh vim python3 mariadb openrc
RUN rc boot
RUN mysql_install_db --user=mysql --datadir=/var/lib/mysql
RUN mysql_secure_installation
RUN pip3 install --upgrade pip
RUN pip3 install flask python-dotenv mysql-connector-python flask-restful flask-session flask-wtf click flask-mysql
VOLUME ./matcha 
COPY . /matcha
