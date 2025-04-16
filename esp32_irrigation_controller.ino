#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>

// === Pins ===
#define analogPin 35
#define rainAnalogPin 34
#define DHTPIN 17
#define DHTTYPE DHT22
#define RELAY_PIN 32

// === Capteurs & LCD ===
LiquidCrystal_I2C lcd(0x27, 16, 2);
DHT dht(DHTPIN, DHTTYPE);

// === WiFi & ThingSpeak ===
const char* ssid = "Redmi 12";
const char* password = "mamapapa1";
const char* server = "api.thingspeak.com";
String apiKey = "5VEAKRMZA8A1GM69";
String readApiKey = "LTA8AGP5GAQHA6E9";

// === Variables ===
float temperature = 0.0;
float humidity = 0.0;
float simulatedPressure = 1013.25;
float rainMM = 0.0;
int soilMoisture = 0;
float soilMoisturePercent = 0;
int manualPumpControl = -1;
bool pumpState = false;
bool isAutoMode = true;  // Par défaut en mode automatique
unsigned long lastModeChangeTime = 0;
bool lastModeValue = true; // Pour détecter les changements de mode

unsigned long lastSensorUpdate = 0;
unsigned long lastDisplayChange = 0;
unsigned long lastThingSpeakCheck = 0;
int currentScreen = 0;

const unsigned long displayInterval = 2000;   // 2 secondes
const unsigned long sensorUpdateInterval = 20000; // 20 secondes
const unsigned long thingSpeakCheckInterval = 15000; // 15 secondes (réduit pour une meilleure réactivité)

// === Fonctions ===
int readSoilMoisture() {
  int total = 0;
  for (int i = 0; i < 10; i++) {
    total += analogRead(analogPin);
    delay(10);
  }
  return total / 10;
}

float readRainIntensity() {
  int rainAnalogValue = analogRead(rainAnalogPin);
  return map(rainAnalogValue, 0, 4095, 10, 0);
}

void sendToThingSpeak() {
  WiFiClient client;
  if (client.connect(server, 80)) {
    String postStr = "api_key=" + apiKey;
    postStr += "&field1=" + String(temperature);
    postStr += "&field2=" + String(humidity);
    postStr += "&field3=" + String(soilMoisturePercent);
    postStr += "&field4=" + String(rainMM);
    postStr += "&field5=" + String(pumpState ? 1 : 0);
    postStr += "&field6=" + String(simulatedPressure);
    postStr += "&field7=" + String(isAutoMode ? 0 : 1);  // Ajouter le mode (0=auto, 1=manuel)

    client.print("POST /update HTTP/1.1\n");
    client.print("Host: api.thingspeak.com\n");
    client.print("Connection: close\n");
    client.print("Content-Type: application/x-www-form-urlencoded\n");
    client.print("Content-Length: " + String(postStr.length()) + "\n\n");
    client.print(postStr);

    delay(1000);
    client.stop();
    Serial.println("Données envoyées à ThingSpeak !");
  }
}

// Fonction pour vérifier les commandes depuis ThingSpeak
void checkThingSpeakCommands() {
  HTTPClient http;
  
  // Ajouter un timestamp pour éviter la mise en cache
  unsigned long timestamp = millis();
  String url = "https://api.thingspeak.com/channels/2907633/feeds/last.json?api_key=" + readApiKey + "&t=" + timestamp;
  
  http.begin(url);
  int httpCode = http.GET();
  
  if (httpCode > 0) {
    String payload = http.getString();
    Serial.println("Réponse ThingSpeak: " + payload);
    
    // Extraire les valeurs des champs
    int field5Index = payload.indexOf("\"field5\":\"");
    int field7Index = payload.indexOf("\"field7\":\"");
    
    if (field7Index > 0) {
      // Extraire la valeur du mode (field7)
      int startIndex = field7Index + 10;
      int endIndex = payload.indexOf("\"", startIndex);
      String modeValue = payload.substring(startIndex, endIndex);
      
      // 0 = auto, 1 = manuel
      bool newAutoMode = (modeValue == "0");
      
      // Vérifier si le mode a changé
      if (isAutoMode != newAutoMode) {
        isAutoMode = newAutoMode;
        lastModeChangeTime = millis();
        lastModeValue = isAutoMode;
        
        Serial.println("Mode changé: " + String(isAutoMode ? "AUTO" : "MANUEL"));
        
        // Si on passe en mode auto, réinitialiser l'état de la pompe selon les conditions
        if (isAutoMode) {
          updateSensors(); // Mettre à jour les capteurs immédiatement
        }
      }
    }
    
    if (!isAutoMode && field5Index > 0) {
      // En mode manuel, extraire l'état de la pompe (field5)
      int startIndex = field5Index + 10;
      int endIndex = payload.indexOf("\"", startIndex);
      String pumpValue = payload.substring(startIndex, endIndex);
      
      bool newPumpState = (pumpValue == "1");
      if (pumpState != newPumpState) {
        pumpState = newPumpState;
        digitalWrite(RELAY_PIN, pumpState ? HIGH : LOW);
        Serial.println("État de la pompe changé manuellement: " + String(pumpState ? "ON" : "OFF"));
      }
    }
  } else {
    Serial.println("Erreur HTTP lors de la vérification ThingSpeak: " + String(httpCode));
  }
  
  http.end();
}

void updateSensors() {
  humidity = dht.readHumidity();
  temperature = dht.readTemperature();
  rainMM = readRainIntensity();
  soilMoisture = readSoilMoisture();
  soilMoisturePercent = map(soilMoisture, 0, 4095, 0, 100);

  // Logique de contrôle de la pompe
  if (!isAutoMode) {
    // En mode manuel, l'état de la pompe est contrôlé par l'interface web
    // Ne rien faire ici, car l'état est déjà mis à jour par checkThingSpeakCommands()
    Serial.println("Mode manuel: état de la pompe contrôlé par l'interface web");
  } else {
    // En mode automatique, utiliser la logique existante
    bool newPumpState = (temperature > 16.3) &&
                (rainMM < 2.2 && (humidity < 62.4 || soilMoisturePercent < 33.6));
    
    if (pumpState != newPumpState) {
      pumpState = newPumpState;
      digitalWrite(RELAY_PIN, pumpState ? HIGH : LOW);
      Serial.println("Mode auto: état de la pompe changé automatiquement: " + String(pumpState ? "ON" : "OFF"));
    }
  }

  // === Affichage série ajouté ===
  Serial.println("====== Données Capteurs ======");
  Serial.println("Temp: " + String(temperature) + " °C");
  Serial.println("Humidité: " + String(humidity) + " %");
  Serial.println("Sol: " + String(soilMoisturePercent) + " %");
  Serial.println("Pluie: " + String(rainMM) + " mm");
  Serial.println("Pression: " + String(simulatedPressure) + " hPa");
  Serial.println("Pompe: " + String(pumpState ? "ON" : "OFF"));
  Serial.println("Mode: " + String(isAutoMode ? "AUTO" : "MANUEL"));
  Serial.println("==============================");
}

void handleSerialInput() {
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    input.trim();
    if (input.equalsIgnoreCase("ON")) {
      pumpState = true;
      digitalWrite(RELAY_PIN, HIGH);
      isAutoMode = false;
      Serial.println("Pompe activée manuellement via série");
    }
    else if (input.equalsIgnoreCase("OFF")) {
      pumpState = false;
      digitalWrite(RELAY_PIN, LOW);
      isAutoMode = false;
      Serial.println("Pompe désactivée manuellement via série");
    }
    else if (input.equalsIgnoreCase("AUTO")) {
      isAutoMode = true;
      Serial.println("Mode automatique activé via série");
    }
    else if (input.equalsIgnoreCase("STATUS")) {
      Serial.println("====== STATUT ACTUEL ======");
      Serial.println("Mode: " + String(isAutoMode ? "AUTO" : "MANUEL"));
      Serial.println("Pompe: " + String(pumpState ? "ON" : "OFF"));
      Serial.println("==========================");
    }
  }
}

void displayLoop() {
  switch (currentScreen) {
    case 0:
      lcd.setCursor(0, 0); lcd.print("Temp: " + String(temperature, 1) + " C  ");
      lcd.setCursor(0, 1); lcd.print("Hum : " + String(humidity, 0) + " %   ");
      break;
    case 1:
      lcd.setCursor(0, 0); lcd.print("Pluie: " + String(rainMM, 1) + " mm ");
      lcd.setCursor(0, 1); lcd.print("Press: " + String(simulatedPressure, 0)+ " hPa");
      break;
    case 2:
      lcd.setCursor(0, 0); lcd.print("Sol  : " + String(soilMoisturePercent) + " %  ");
      lcd.setCursor(0, 1); 
      if (isAutoMode) {
        lcd.print("Mode: AUTO " + String(pumpState ? "ON " : "OFF"));
      } else {
        lcd.print("Mode: MAN  " + String(pumpState ? "ON " : "OFF"));
      }
      break;
  }
  currentScreen = (currentScreen + 1) % 3;
}

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);
  lcd.begin();
  lcd.backlight();
  dht.begin();
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(rainAnalogPin, INPUT);

  lcd.setCursor(0, 0); lcd.print("Connexion WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  lcd.clear(); lcd.print("WiFi Connecté !");
  delay(2000);
  lcd.clear();
  
  Serial.println("====== SYSTÈME DÉMARRÉ ======");
  Serial.println("Commandes disponibles:");
  Serial.println("ON - Activer la pompe (mode manuel)");
  Serial.println("OFF - Désactiver la pompe (mode manuel)");
  Serial.println("AUTO - Passer en mode automatique");
  Serial.println("STATUS - Afficher l'état actuel");
  Serial.println("============================");
}

void loop() {
  handleSerialInput();

  // Mise à jour des capteurs toutes les 20 secondes
  if (millis() - lastSensorUpdate > sensorUpdateInterval) {
    updateSensors();
    sendToThingSpeak();
    lastSensorUpdate = millis();
  }

  // Vérifier les commandes ThingSpeak toutes les 15 secondes
  if (millis() - lastThingSpeakCheck > thingSpeakCheckInterval) {
    checkThingSpeakCommands();
    lastThingSpeakCheck = millis();
  }

  // Défilement affichage toutes les 2 secondes
  if (millis() - lastDisplayChange > displayInterval) {
    lcd.clear();
    displayLoop();
    lastDisplayChange = millis();
  }
}
