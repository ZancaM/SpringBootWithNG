# Angular Js + SPRING BOOT 

## Getting Started

### SPRING CLI

```
spring init --dependencies web,security,jpa ui/ && cd ui

```

###OR Init Spring Website

https://start.spring.io/
and choosing Web, Security, and JPA

### Prerequisites

If you are using spring CLI 
[Spring CLI Installation](http://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#getting-started-installing-the-cli).

### Run the Application

```
mvn spring-boot:run
```

### Package And Run

```
mvn package && java -jar target/*.jar
```