CREATE TABLE "logs" (
"id"  SERIAL ,
"event" INTEGER ,
"channel" INTEGER ,
"nick" INTEGER ,
"datetime" TIMESTAMP WITH TIME ZONE ,
"network" INTEGER ,
"message" VARCHAR(512) ,
PRIMARY KEY ("id")
);

CREATE TABLE "nicks" (
"id"  SERIAL ,
"nick" VARCHAR(50) ,
PRIMARY KEY ("id")
);

CREATE TABLE "events" (
"id"  SERIAL ,
"event" VARCHAR(20) ,
PRIMARY KEY ("id")
);

CREATE TABLE "networks" (
"id"  SERIAL ,
"network" INTEGER NOT NULL ,
PRIMARY KEY ("id")
);

CREATE TABLE "channels" (
"id"  SERIAL ,
"channel" VARCHAR(150) NOT NULL DEFAULT 'NULL' ,
PRIMARY KEY ("id")
);

ALTER TABLE "logs" ADD FOREIGN KEY ("event") REFERENCES "events" ("id");
ALTER TABLE "logs" ADD FOREIGN KEY ("channel") REFERENCES "channels" ("id");
ALTER TABLE "logs" ADD FOREIGN KEY ("nick") REFERENCES "nicks" ("id");
ALTER TABLE "logs" ADD FOREIGN KEY ("network") REFERENCES "networks" ("id");
