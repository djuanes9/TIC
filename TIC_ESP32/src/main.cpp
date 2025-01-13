#include <Arduino.h>
#include <AccelStepper.h>
#include <ESP32_Servo.h>

// Pines para el motor a pasos
#define STEP_PIN 17   // Pin para el pulso de paso
#define DIR_PIN 26    // Pin para la dirección del motor
#define ENABLE_PIN 27 // Pin para habilitar el motor

// Pines para los servomotores
#define SERVO1_PIN 23
#define SERVO2_PIN 15

// Pines para entradas digitales de los servos
#define S1_PIN 32        // Entrada para Servo 1
#define S2_D0_PIN 33     // Entrada digital 0 para Servo 2
#define S2_D1_PIN 35     // Entrada digital 1 para Servo 2

// Pines de entradas digitales para el motor
#define STEP_TRIGGER_PIN 34 // Activar motor con estado digital

// Pines del sensor ultrasónico
#define TRIG_PIN 12
#define ECHO_PIN 13

// Pin ADC para velocidad del motor
#define ADC_PIN 14 // Entrada analógica (GPIO36 / VP)

// Crear instancia de AccelStepper
AccelStepper stepper(AccelStepper::DRIVER, STEP_PIN, DIR_PIN);

// Variables globales
Servo servo1;
Servo servo2;
volatile bool stepMotorActive = false; // Estado del motor controlado por STEP_TRIGGER_PIN
volatile float distance = 0.0;         // Distancia medida por el sensor ultrasónico

// Variables para control de velocidad
float currentSpeed = 0;   // Velocidad actual del motor
float targetSpeed = 0;    // Velocidad deseada
int lastAdcValue = -1;    // Último valor leído del ADC

// Mutex para proteger acceso compartido al sensor ultrasónico
SemaphoreHandle_t ultrasonicMutex;

// Función para medir la distancia con el sensor ultrasónico
void measureDistance() {
  if (xSemaphoreTake(ultrasonicMutex, portMAX_DELAY)) {
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    long duration = pulseIn(ECHO_PIN, HIGH);
    distance = (duration / 2.0) * 0.0343;
    distance = constrain(distance, 0, 100);

    xSemaphoreGive(ultrasonicMutex);
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

    measureDistance();
    delay(50);
  }
}

// Función para calcular la velocidad basada en el ADC
float getFixedSpeed(int adcValue) {
  if (adcValue <= 1023) {
    return 200;
  } else if (adcValue <= 2047) {
    return 400;
  } else if (adcValue <= 3071) {
    return 600;
  } else {
    return 800;
  }
}

// Suavizar cambios de velocidad
void updateSpeed() {
  if (currentSpeed < targetSpeed) {
    currentSpeed += 10; // Incremento gradual
    if (currentSpeed > targetSpeed) {
      currentSpeed = targetSpeed;
    }
  } else if (currentSpeed > targetSpeed) {
    currentSpeed -= 10; // Decremento gradual
    if (currentSpeed < targetSpeed) {
      currentSpeed = targetSpeed;
    }
  }

  stepper.setSpeed(currentSpeed);
}

// Función para el control del motor a pasos (Core 1)
void stepperTask(void *parameter) {
  pinMode(ENABLE_PIN, OUTPUT);
  digitalWrite(ENABLE_PIN, HIGH);
  pinMode(STEP_TRIGGER_PIN, INPUT_PULLDOWN);

  stepper.setMaxSpeed(800);

  for (;;) {
    stepMotorActive = digitalRead(STEP_TRIGGER_PIN);

    if (stepMotorActive) {
      digitalWrite(ENABLE_PIN, LOW);

      int adcValue = analogRead(ADC_PIN);

      // Actualizar velocidad solo si el ADC cambia significativamente
      if (abs(adcValue - lastAdcValue) > 50) {
        targetSpeed = getFixedSpeed(adcValue);
        lastAdcValue = adcValue;

        Serial.print("ADC Value: ");
        Serial.print(adcValue);
        Serial.print(" | Target Speed: ");
        Serial.println(targetSpeed);
      }

      updateSpeed(); // Suavizar cambios de velocidad
      stepper.runSpeed();
    } else {
      digitalWrite(ENABLE_PIN, HIGH);
    }

    taskYIELD();
  }
}

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  ultrasonicMutex = xSemaphoreCreateMutex();

  Serial.begin(115200);
  Serial.println("Sistema iniciado");

  xTaskCreatePinnedToCore(servoTask, "Servo Task", 10000, NULL, 1, NULL, 0);
  xTaskCreatePinnedToCore(stepperTask, "Stepper Task", 10000, NULL, 1, NULL, 1);
}

void loop() {
}
