#include <Arduino.h>
#include <AccelStepper.h>
#include <ESP32_Servo.h>

// Pines para el motor a pasos
#define STEP_PIN 13         // Pin para el pulso de paso
#define DIR_PIN 2          // Pin para la dirección del motor
#define ENABLE_PIN 12       // Pin para habilitar el motor

// Pines para los servomotores
#define SERVO1_PIN 18
#define SERVO2_PIN 19

// Pines para entradas digitales de los servos
#define S1_PIN 14          // Entrada para Servo 1
#define S2_D0_PIN 27        // Entrada digital 0 para Servo 2
#define S2_D1_PIN 16        // Entrada digital 1 para Servo 2

// Pines de entradas digitales para el motor
#define STEP_TRIGGER_PIN 17 // Activar motor con estado digital
#define SPEED_CONTROL_PIN 25 // Control de velocidad: baja (LOW) o alta (HIGH)

// Crear instancia de AccelStepper
AccelStepper stepper(AccelStepper::DRIVER, STEP_PIN, DIR_PIN);

// Variables globales
Servo servo1;
Servo servo2;

// Velocidades fijas
const float LOW_SPEED = 800;  // Velocidad baja en pasos/segundo
const float HIGH_SPEED = 1100; // Velocidad alta en pasos/segundo
float currentSpeed = LOW_SPEED; // Velocidad actual del motor

// Función para el control del motor a pasos (Core 1)
void stepperTask(void *parameter) {
  // Configuración inicial de los pines
  pinMode(ENABLE_PIN, OUTPUT);
  pinMode(STEP_TRIGGER_PIN, INPUT_PULLDOWN);
  pinMode(SPEED_CONTROL_PIN, INPUT_PULLDOWN);
  digitalWrite(ENABLE_PIN, HIGH); // Inicialmente deshabilitado

  // Configuración inicial del motor
  stepper.setMaxSpeed(1200);       // Configuración de velocidad máxima permitida
  stepper.setAcceleration(200);   // Configuración de aceleración

  for (;;) {
    // Leer el estado del pin de activación del motor
    bool stepMotorActive = digitalRead(STEP_TRIGGER_PIN);

    if (stepMotorActive) {
      digitalWrite(ENABLE_PIN, LOW); // Habilitar el motor

      // Leer el estado del pin de control de velocidad
      if (digitalRead(SPEED_CONTROL_PIN) == HIGH) {
        currentSpeed = HIGH_SPEED; // Velocidad alta
      } else {
        currentSpeed = LOW_SPEED; // Velocidad baja
      }

      // Establecer la velocidad del motor
      stepper.setSpeed(currentSpeed);

      // Mostrar información en el monitor serial
      Serial.print("Velocidad actual: ");
      Serial.println(currentSpeed);

      // Mover el motor a la velocidad actual
      stepper.runSpeed();
    } else {
      digitalWrite(ENABLE_PIN, HIGH); // Deshabilitar el motor
    }

    taskYIELD(); // Ceder tiempo al resto de tareas
  }
}

// Función para el control de servomotores (Core 0)
void servoTask(void *parameter) {
  servo1.attach(SERVO1_PIN, 500, 2500);
  servo2.attach(SERVO2_PIN, 500, 2500);

  servo1.write(0);
  servo2.write(90);

  pinMode(S1_PIN, INPUT_PULLDOWN);
  pinMode(S2_D0_PIN, INPUT_PULLDOWN);
  pinMode(S2_D1_PIN, INPUT_PULLDOWN);

  for (;;) {
    if (digitalRead(S1_PIN) == HIGH) {
      servo1.write(180);
    } else {
      servo1.write(0);
    }

    if (digitalRead(S2_D0_PIN)) {
      servo2.write(180);
    } else if (digitalRead(S2_D1_PIN)) {
      servo2.write(0);
    } else {
      servo2.write(90);
    }

    delay(50); // Pequeño retraso para estabilizar la lectura
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("Sistema iniciado. Control de velocidad por entradas digitales:");

  // Configuración de los pines de entrada
  pinMode(STEP_TRIGGER_PIN, INPUT_PULLDOWN);
  pinMode(SPEED_CONTROL_PIN, INPUT_PULLDOWN);
  pinMode(ENABLE_PIN, OUTPUT);
  digitalWrite(ENABLE_PIN, HIGH); // Motor deshabilitado inicialmente

  // Crear la tarea para controlar el motor paso a paso en el Core 1
  xTaskCreatePinnedToCore(stepperTask, "Stepper Task", 10000, NULL, 1, NULL, 1);

  // Crear la tarea para controlar los servos en el Core 0
  xTaskCreatePinnedToCore(servoTask, "Servo Task", 10000, NULL, 1, NULL, 0);
}

void loop() {
  // Nada que hacer en el bucle principal
}
