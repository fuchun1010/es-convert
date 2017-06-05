create table bigeye_car
(
	id        int primary key auto_increment,
	province  varchar(50) not null,
	city      varchar(50) not null,
	location  varchar(50) not null,
	brand     varchar(50) not null,
	car       varchar(50) not null,
	cost      numeric(10,2) default 0.00 not null,
	sales 	  numeric(10,2) default 0.00 not null
);

insert into bigeye_car(province, city, location, brand, car, cost, sales)
select '四川', '成都', '武侯区', 'Audi', 'A4L', 295000, 315000 union
select '四川', '绵阳', '三台县', 'Audi', 'A6L', 345000, 750000 union
select '四川', '德阳', '剑阁县', 'Audi', 'A7',  665000, 985000 union
select '四川', '广汉', '临安', 'BMW',  '3系', 305000, 375000 union
select '四川', '广汉', '什邡市', 'BMW', '5系列', 650000, 960000 union
select '重庆', '江北区', '新牌坊', 'Audi', 'A4L', 315000, 345000 union
select '重庆', '南岸区', '茶园', 'Audi', 'A4L', 305000, 335000 union
select '重庆', '南岸区', '茶园', 'BMW', '3系列', 325000, 355000 union
select '重庆', '长寿区', '晏家', 'BMW', '5系列', 555000, 755000;
