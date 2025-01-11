#include <Arduino.h>
#include <ESP32_Servo.h>

// Pines del sensor ultrasónico
#define TRIG_PIN 5  // Pin TRIG del sensor ultrasónico
#define ECHO_PIN 18 // Pin ECHO del sensor ultrasónico

// Pines de los servomotores y sus controles
#define SERVO1_PIN 19
#define SERVO1_CONTROL_PIN 23
#define SERVO2_PIN 21
#define SERVO2_D0 22
#define SERVO2_D1 14
// Configuración DAC
#define DAC_PIN 25 // Salida DAC para señal analógica

// Objetos para los servomotores
Servo servo1; //Servo Tapa Silo
Servo servo2; //Servo Tamizadora

// Configuración inicial
void setup() {
  // Configuración de pines ultrasónico
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  // Configuración de servomotores
  servo1.attach(SERVO1_PIN,500,1800);
  servo2.attach(SERVO2_PIN,500,2500);

  // Configuración de pines de control
  pinMode(SERVO1_CONTROL_PIN, INPUT);
  pinMode(SERVO2_D0, INPUT);
  pinMode(SERVO2_D1, INPUT);

  // Inicialización
  servo1.write(0); // Servomotor 1 en posición inicial
  servo2.write(90); // Servomotor 2 en posición inicial
}

float readUltrasonicDistance() {
  // Generar pulso TRIG
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Leer duración del pulso ECHO
  long duration = pulseIn(ECHO_PIN, HIGH);

  // Convertir a distancia en cm
  float distance = duration * 0.034 / 2;
  return distance;
}

void setAnalogOutput(float distance, float maxDistance) {
  // Convertir distancia a rango de 0 a 3.3V (DAC admite 8 bits: 0 a 255)
  int dacValue = map(distance, 0, maxDistance, 0, 255);
  dacValue = constrain(dacValue, 0, 255); // Limitar a valores válidos
  dacWrite(DAC_PIN, dacValue);
}

void loop() {
  // --- Control de servomotores ---
  // Servomotor 1
  if (digitalRead(SERVO1_CONTROL_PIN) == HIGH) {
    servo1.write(180); // Activa el servo1 a 180°
  } else {
    servo1.write(0);   // Retorna a 0°
  }

  // Servomotor 2
  if (digitalRead(SERVO2_D0) == HIGH) {
    servo2.write(180); // Activa el servo2 a 180°
  } else if(digitalRead(SERVO2_D1) == HIGH){
    servo2.write(0);   // Retorna a 0°
  }else{
    servo2.write(90);   // Retorna a 0°
  }

  // --- Lectura del sensor ultrasónico ---
  float distance = readUltrasonicDistance();
  distance = constrain(distance, 0, 16.0); // Limitar a 16 cm

  // --- Salida DAC proporcional a la distancia ---
  setAnalogOutput(distance, 16.0);

  delay(50); // Breve retraso para estabilidad
}
