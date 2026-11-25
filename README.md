# Architecture Web Distribuée : Eureka Server et Observabilité

Projet réalisé dans le cadre du cours **Architecture Web Distribuée** (ESPRIT, année universitaire 2026-2027), en deux ateliers :

1. **Atelier 1 : Eureka Server** (découverte de services avec des microservices Spring Boot, Node.js et Python).
2. **Atelier 2 : Observabilité** (santé, informations et propagation de l'état des services vers Eureka).

## Équipe

**Équipe : Pionneer**

| Nom et prénom | 

| Missaoui Jasser| 
| Akrout Aziz | 
| Jbeli Yassmine |
| Selmi Raghed |

## Architecture

| Microservice | Technologie | Port | Nom dans Eureka |
|---|---|---|---|
| Discovery (Eureka Server) | Spring Boot | 8761 | n/a |
| Candidat | Spring Boot + H2 | 8081 (et 8091) | `CANDIDAT` |
| Job | Spring Boot + MySQL | 8082 | `JOB` |
| Meeting | Node.js / Express | 8083 (et 8093) | `MEETING` |
| Notification | Python / FastAPI | 8084 (et 8094) | `NOTIFICATION` |

---

# Atelier 1 : Eureka Server

**Capture 1.** Candidat (8081) et Job (8082) s'enregistrent dans Eureka et apparaissent en UP, avec une instance chacun.

![Capture 1 : Candidat et Job enregistrés](docs/01-candidat-job-enregistres.png)

**Capture 2.** Une deuxième instance de Candidat lancée sur le port 8091 apparaît à côté de la première, et `CANDIDAT` passe à UP (2).

![Capture 2 : Candidat avec 2 instances](docs/02-candidat-2-instances.png)

**Capture 3.** Meeting (Node.js) s'enregistre sous le nom `MEETING` avec deux instances, 8083 et 8093, en plus de Candidat et Job.

![Capture 3 : Meeting avec 2 instances](docs/03-meeting-2-instances.png)

**Capture 4.** Les quatre services CANDIDAT, JOB, MEETING et NOTIFICATION sont visibles en même temps dans le dashboard, avec deux instances de CANDIDAT, MEETING et NOTIFICATION.

![Capture 4 : dashboard avec les 4 services](docs/04-dashboard-4-services.png)

---

# Atelier 2 : Observabilité

## Spring Boot Actuator (Candidat et Job)

**Capture 5.** `/actuator/health` de Job renvoie le statut UP, avec le détail de la base MySQL, de la découverte Eureka (services et nombre d'instances) et de l'espace disque.

![Capture 5 : health de Job en UP](docs/05-health-job-up.png)

**Capture 6.** Lorsque la base MySQL est arrêtée, JOB passe en DOWN (en rouge) dans Eureka alors que les autres services restent UP, ce qui prouve que la santé d'Actuator remonte bien dans l'annuaire.

![Capture 6 : JOB en DOWN dans Eureka](docs/06-job-down-eureka.png)

**Capture 7.** `/actuator/info` de Candidat renvoie le nom, la version, la description et le nom de l'équipe du service.

![Capture 7 : info de Candidat](docs/07-info-candidat.png)

## Santé de Meeting (Node.js)

**Capture 8.** `GET /health` sur Meeting (port 8083) renvoie `{"status": "UP"}`.

![Capture 8 : health de Meeting](docs/08-health-meeting.png)

**Capture 9.** `GET /info` sur la deuxième instance de Meeting (port 8093) renvoie le nom, la version et la description du service.

![Capture 9 : info de Meeting](docs/09-info-meeting.png)

## Santé de Notification (Python)

**Capture 10.** `GET /health` sur Notification (port 8084) renvoie `{"status": "UP"}`.

![Capture 10 : health de Notification](docs/10-health-notification.png)

**Capture 11.** `GET /info` sur Notification renvoie son nom, sa version et sa description.

![Capture 11 : info de Notification](docs/11-info-notification.png)

**Capture 12.** Le registre Eureka de `NOTIFICATION` contient bien les adresses `healthCheckUrl`, `statusPageUrl` et `homePageUrl` déclarées par l'instance.

![Capture 12 : registre NOTIFICATION](docs/12-registre-notification.png)
