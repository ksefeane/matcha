FROM alpine
RUN apk update && apk add zsh vim python3 mariadb
VOLUME ./matcha 
COPY . /matcha
RUN pip3 install --upgrade pip
RUN pip3 install flask python-dotenv mysql-connector-python
CMD flask run
