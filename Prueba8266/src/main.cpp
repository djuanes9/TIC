#include <Arduino.h>
#include <Servo.h>

// Definir el pin del servo motor y del botón (entrada digital)
const int pinServo = D4;    // Pin donde conectas la señal del servo (GPIO2)
const int pinEntrada = D5;  // Pin donde conectas la entrada digital (GPIO14)

// Definir pines para el motor con puente H
const int pinMotorIN1 = D6;  // IN1 del puente H
const int pinMotorIN2 = D7;  // IN2 del puente H
const int pinPWMMotor = D8;  // Pin PWM para controlar la velocidad del motor

// Pin para la entrada digital que activa el motor
const int pinMotorControl = D1;  // Pin para activar el motor (GPIO5)

// Crear un objeto para el servo
Servo miServo;

// Variables para la posición del servo
int posicionActual = 0;     // Posición inicial del servo
int incremento = 3;         // Incremente de ángulo en cada paso
int delayMovimiento = 30;   // Tiempo de espera entre cada movimiento (milisegundos)

// Variables para el motor
int velocidadMotor = 255;   // Velocidad del motor (0-255 PWM)
bool motorEncendido = false;

void setup() {
  // Iniciar el puerto serie para depuración
  Serial.begin(9600);

  // Adjuntar el servo al pin correspondiente
  miServo.attach(pinServo);

  // Configurar el pin de la entrada como entrada con pull-up interna
  pinMode(pinEntrada, INPUT);
pinMode(pinMotorControl, INPUT);

// Configurar los pines del puente H como salidas
  pinMode(pinMotorIN1, OUTPUT);
  pinMode(pinMotorIN2, OUTPUT);
  pinMode(pinPWMMotor, OUTPUT);

  // Inicializar el motor apagado
  digitalWrite(pinMotorIN1, LOW);
  digitalWrite(pinMotorIN2, LOW);
  analogWrite(pinPWMMotor, 0);  // PWM en 0, motor apagado

  // Posicionar el servo inicialmente en 0 grados
  miServo.write(posicionActual);
}

void moverServoLento(int posicionInicial, int posicionFinal) {
  if (posicionInicial < posicionFinal) {
    for (int pos = posicionInicial; pos <= posicionFinal; pos += incremento) {
      miServo.write(pos);
      delay(delayMovimiento);  // Esperar entre cada movimiento
    }
  } else {
    for (int pos = posicionInicial; pos >= posicionFinal; pos -= incremento) {
      miServo.write(pos);
      delay(delayMovimiento);  // Esperar entre cada movimiento
    }
  }
}

void controlarMotor(bool activar) {
  if (activar) {
    // Mover motor en una dirección
    digitalWrite(pinMotorIN1, HIGH);
    digitalWrite(pinMotorIN2, LOW);
    analogWrite(pinPWMMotor, velocidadMotor);  // Controlar velocidad del motor con PWM
    Serial.println("Motor activado");
  } else {
    // Detener el motor
    digitalWrite(pinMotorIN1, LOW);
    digitalWrite(pinMotorIN2, LOW);
    analogWrite(pinPWMMotor, 0);  // Detener el motor
    Serial.println("Motor apagado");
  }
}


void loop() {
  // Leer el estado de la entrada digital
  int estadoEntrada = digitalRead(pinEntrada);

  if (estadoEntrada == HIGH) {
    // Si la entrada está en alto, mover el servo lentamente a 180 grados
    if (posicionActual != 180) {
      moverServoLento(posicionActual, 180);
      posicionActual = 180;  // Actualizar la posición actual
      Serial.println("Servo movido a 180 grados");
    }
  } else {
    // Si la entrada está en bajo, mover el servo lentamente a 0 grados
    if (posicionActual != 0) {
      moverServoLento(posicionActual, 0);
      posicionActual = 0;  // Actualizar la posición actual
      Serial.println("Servo movido a 0 grados");
    }
  }

  // Leer el estado del pin de control del motor (activar o desactivar)
  int estadoMotor = digitalRead(pinMotorControl);

  if (estadoMotor == HIGH && !motorEncendido) {
    // Activar el motor si no está encendido
    controlarMotor(true);
    motorEncendido = true;
  } else if (estadoMotor == LOW && motorEncendido) {
    // Apagar el motor si está encendido
    controlarMotor(false);
    motorEncendido = false;
  }

  // Pequeño retraso para evitar lecturas erróneas en el bucle
  delay(50);
}
