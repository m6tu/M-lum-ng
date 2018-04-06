create database memorygame;

use memorygame;

create table score (
	id int auto_increment primary key,
    name varchar(100),
    score int not null
);

grant all privileges on memorygame.* to 'memorygame'@'localhost' identified by 'demo';
