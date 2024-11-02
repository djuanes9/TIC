#include <Arduino.h>
#include <ESP32_Servo.h>  // Usamos la biblioteca ESP32Servo

// Configuración del servo motor
const int pinServo = 18;         // Pin GPIO para el servo
const int pinEntradaServo = 19;  // Pin de entrada digital para controlar el movimiento del servo
Servo miServo;

int posicionActual = 0;          // Posición inicial del servo
int posicionFinal = 0;           // Posición objetivo del servo (0 o 180 grados)
int incremento = 1;              // Grados a moverse en cada paso
unsigned long intervaloMovimiento = 5; // Intervalo de tiempo entre movimientos, en milisegundos
unsigned long ultimoMovimiento = 0;     // Almacena el último tiempo de movimiento del servo

// Configuración del motor DC
const int pinMotorIN1 = 5;       // IN1 del puente H
const int pinMotorIN2 = 17;      // IN2 del puente H
const int pinPWMMotor = 15;      // Pin PWM para controlar la velocidad del motor
const int pinEntradaMotor = 4;   // Pin de entrada digital para activar el motor
const int pinPotenciometro = 2; // Pin analógico para el potenciómetro (control de velocidad PWM)
int velocidadMotor = 0;          // Velocidad del motor en PWM (0-255)
bool motorEncendido = false;     // Estado del motor

// Declaración de las funciones
void movimientoServo();
void controlarMotorDC();

void setup() {
  Serial.begin(9600);

  // Configurar el servo
  miServo.attach(pinServo,500,2500);
  pinMode(pinEntradaServo, INPUT);
  miServo.write(posicionActual);

  // Configurar los pines del motor y PWM
  pinMode(pinMotorIN1, OUTPUT);
  pinMode(pinMotorIN2, OUTPUT);
  pinMode(pinEntradaMotor, INPUT);

  //falta arreglar setup de pwm motordc

  ledcSetup(2,500,8);
  ledcAttachPin(pinPWMMotor,2);
}

void loop() {
  // Control del movimiento del servo
  movimientoServo();

  // Control del motor DC
  controlarMotorDC();
}

// Función para mover el servo lentamente sin bloquear el código
void movimientoServo() {
  int estadoEntradaServo = digitalRead(pinEntradaServo);

  if (estadoEntradaServo == HIGH) {
    miServo.write(180);  // Mover el servo a 180 grados
    Serial.println("Servo en posición 180");
  } else {
    miServo.write(0);    // Mover el servo a 0 grados
    Serial.println("Servo en posición 0");
  }
}

// Función para controlar el motor DC con entrada digital y ajuste de velocidad PWM
void controlarMotorDC() {
  int estadoEntradaMotor = digitalRead(pinEntradaMotor);

  if (estadoEntradaMotor == HIGH) {
    if (!motorEncendido) {
      motorEncendido = true;
      digitalWrite(pinMotorIN1, HIGH);
      digitalWrite(pinMotorIN2, LOW);
      Serial.println("Motor activado");
    }

    // Control de la velocidad del motor mediante PWM
    int valorPotenciometro = analogRead(pinPotenciometro);  // Leer la entrada analógica
    velocidadMotor = map(valorPotenciometro, 0, 4095, 0, 255);  // Mapear a rango PWM (0-255)
    ledcWrite(2, velocidadMotor);  // Ajustar la velocidad del motor con PWM
    Serial.print("Velocidad del motor: ");
    Serial.println(velocidadMotor);
  } else if (motorEncendido) {
    motorEncendido = false;
    digitalWrite(pinMotorIN1, LOW);
    digitalWrite(pinMotorIN2, LOW);
    ledcWrite(2, 0);  // Detener el motor (PWM en 0)
    Serial.println("Motor apagado");
  }
}
