# Diplomarbeit an der Höheren Fachschule Südostschweiz

## Digitale Transformation der Arbeitserfassung

## Entwicklung einer webbasierten Anwendung zur

## Effizienzsteigerung und Datenintegrität für den Einsatz in der VP Bank.

## NDS HF Applikationsentwicklung

### Im Auftrag der VP Bank AG

### Diplomarbeit 2024 S. Fluor

## Einleitung

Diese Anwendung dient zur digitalen Erfassung und Verwaltung von Arbeitszeiten. Sie wurde im Rahmen der Diplomarbeit 2024 an der Höheren Fachschule Südostschweiz entwickelt und soll die Effizienz und Datenintegrität bei der Arbeitserfassung in der VP Bank AG verbessern.

## Installation

### Voraussetzungen

- Node.js
- MySQL
- Terminal für die Ausführung der Commands
- Klonen vom Repository:

```bash
https://github.com/sascha1987/time-tracker-application.git
```

### Installation der Dependencies

Führen Sie den folgenden Befehl aus, um alle benötigten Dependencies zu installieren:

```bash
npm install
```

1. Erstellung der Datenbank in der MySQL Workbench

```bash
CREATE DATABASE IF NOT EXISTS Timerecording;
```

2. Wechseln Sie zur erstellten Datenbank:

```bash
USE Timerecording;
```

3. Erstellen Sie die Tabelle für die Benutzer:

```bash
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);
```

4. Fügen Sie einen Testbenutzer hinzu:

```bash
INSERT INTO users (id, username, password)
VALUES (1, 'Sascha', '123456'),
       (2, 'Michael', '456789'),
       (3, 'Edi', '987654'),
       (4, 'Andrea', '666666'),
       (5, 'Joao', '333333');

```

--> Das Passwort muss gehasht sein, verwenden Sie dafür "HelperHashPassword.js"

5. Ausführen von 'node HelperHashPassword.js' im Terminal

6. Überprüfen Sie die Einträge in der Tabelle:

```bash
SELECT * FROM users;
```

7. Stellen Sie sicher, dass der MySQL-Benutzer korrekt konfiguriert ist:

```bash
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'XXPASSWORDXX';
FLUSH PRIVILEGES;
```

8. Erstellen Sie die Tabelle für die Arbeitszeiterfassung

```bash
CREATE TABLE timesheet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    date DATE NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    startTime1 TIME NOT NULL,
    endTime1 TIME NOT NULL,
    hoursNormal DECIMAL(5,2) NOT NULL,
    overtime DECIMAL(5,2) NOT NULL,
    comments VARCHAR(255),
    FOREIGN KEY (userId) REFERENCES users(id)
);
```

9. Zum Starten der Applikation verwenden Sie den folgenden Befehl:

`npm start`

10. Um die Applikation zu testen, führen Sie den folgenden Befehl aus:

`npm test`

---

### Abhängigkeiten

Die Anwendung verwendet die folgenden Hauptpakete:

express: Webframework für Node.js

bcrypt: Bibliothek zum Hashen von Passwörtern

cors: Middleware für Cross-Origin Resource Sharing

jsonwebtoken: Implementierung von JSON Web Tokens

jspdf: Bibliothek zur Erzeugung von PDFs

mysql: MySQL-Client für Node.js

### Entwicklungsabhängigkeiten

Für die Entwicklung und das Testen der Anwendung werden folgende Pakete verwendet:

@babel/core: Babel-Compiler-Core

@babel/preset-env: Babel-Preset für die Umgebung

jest: JavaScript-Testing-Framework

nodemon: Tool zur automatischen Neustart von Node.js-Anwendungen

nyc: Code-Coverage-Tool für JavaScript

Weitere Informationen finden Sie in den Dateien package.json und package-lock.json.

### Autor

S. Fluor
