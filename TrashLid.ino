// Define number of steps in rotation, pins, initialize step motor
#define STEPPER_PIN_1 8
#define STEPPER_PIN_2 9
#define STEPPER_PIN_3 10
#define STEPPER_PIN_4 11
#define HOME_POS 1
#define POS1 2
#define POS2 3
#define POS3 4
#define POS4 5
#define POS5 6
#define COUNTERCLKWISE false
#define CLKWISE true
#define SIXTH_TIME 86
int currentPos;

void setup() {
  Serial.begin(9600);
  // Pin assignments
  pinMode(STEPPER_PIN_1, OUTPUT);
  pinMode(STEPPER_PIN_2, OUTPUT);
  pinMode(STEPPER_PIN_3, OUTPUT);
  pinMode(STEPPER_PIN_4, OUTPUT);
  currentPos = HOME_POS;
}
void loop() {
  if (Serial.available() > 0) {
    //check the trash
    int trashType = detType();
    
    // Move lid to right position
    if (currentPos != trashType) {
      
      // CounterClk rotation is faster
      if (((currentPos > trashType) && ((currentPos - trashType) > 3)) || ((currentPos < trashType) && ((currentPos - trashType) > -3))) {
        currentPos = ClkWise(currentPos, trashType);
      }
      
      // Clockwise rotation is faster
      else {
        currentPos = CounterClk(currentPos, trashType);
      }
    }
    delay(4000);
  }
  // Check if lid is in home position
  else {
    // Move to home position
    if (currentPos != HOME_POS){
      HomePos(currentPos);
      currentPos = HOME_POS;
    }
  }
  delay(500);
}

int CounterClk(int currentPos, int endPos) {
  while (currentPos != endPos) {
    // Rotate -60 deg until reaching end position
    Rotate(COUNTERCLKWISE);
    if (currentPos == HOME_POS) currentPos = POS5;
    else {currentPos-=1;}
  }
  return currentPos;
}
int ClkWise(int currentPos, int endPos) {
  while (currentPos != endPos) {
    // Rotate 60 deg until reaching end position
    Rotate(CLKWISE);
    if (currentPos == POS5) currentPos = HOME_POS;
    else currentPos+=1;
  }
  return currentPos;
}

void HomePos(int startPos) {
  switch(startPos) {
    case POS1:
      Rotate(COUNTERCLKWISE);
      break;
    case POS2:
      Rotate(COUNTERCLKWISE);
      Rotate(COUNTERCLKWISE);
      break;
    case POS3:
      Rotate(COUNTERCLKWISE);
      Rotate(COUNTERCLKWISE);
      Rotate(COUNTERCLKWISE);
      break;
    case POS4:
      Rotate(CLKWISE);
      Rotate(CLKWISE);
      break;
    case POS5:
      Rotate(CLKWISE);
      break;
  }
}

// Manually rotate the motor
// Step method too unresponsive
void Rotate(bool dir) {
  if(!dir){
    for (int time = 0; time < SIXTH_TIME; time++) {
      digitalWrite(STEPPER_PIN_1, HIGH);
      digitalWrite(STEPPER_PIN_2, LOW);
      digitalWrite(STEPPER_PIN_3, LOW);
      digitalWrite(STEPPER_PIN_4, LOW);
      delay(2);
      digitalWrite(STEPPER_PIN_1, LOW);
      digitalWrite(STEPPER_PIN_2, HIGH);
      digitalWrite(STEPPER_PIN_3, LOW);
      digitalWrite(STEPPER_PIN_4, LOW);
      delay(2);
      digitalWrite(STEPPER_PIN_1, LOW);
      digitalWrite(STEPPER_PIN_2, LOW);
      digitalWrite(STEPPER_PIN_3, HIGH);
      digitalWrite(STEPPER_PIN_4, LOW);
      delay(2);
      digitalWrite(STEPPER_PIN_1, LOW);
      digitalWrite(STEPPER_PIN_2, LOW);
      digitalWrite(STEPPER_PIN_3, LOW);
      digitalWrite(STEPPER_PIN_4, HIGH);
      delay(2);
    }
  }else{
    for (int time = 0; time < SIXTH_TIME; time++) {
      digitalWrite(STEPPER_PIN_1, HIGH);
      digitalWrite(STEPPER_PIN_2, LOW);
      digitalWrite(STEPPER_PIN_3, LOW);
      digitalWrite(STEPPER_PIN_4, LOW);
      delay(2);
      digitalWrite(STEPPER_PIN_1, LOW);
      digitalWrite(STEPPER_PIN_2, LOW);
      digitalWrite(STEPPER_PIN_3, LOW);
      digitalWrite(STEPPER_PIN_4, HIGH);
      delay(2);
      digitalWrite(STEPPER_PIN_1, LOW);
      digitalWrite(STEPPER_PIN_2, LOW);
      digitalWrite(STEPPER_PIN_3, HIGH);
      digitalWrite(STEPPER_PIN_4, LOW);
      delay(2);
      digitalWrite(STEPPER_PIN_1, LOW);
      digitalWrite(STEPPER_PIN_2, HIGH);
      digitalWrite(STEPPER_PIN_3, LOW);
      digitalWrite(STEPPER_PIN_4, LOW);
      delay(2);
    } 
  }
}
// Determine which trash type to open
int detType(){
  //based on type, determine a position
  int outputPos = HOME_POS;
  int category = Serial.read();
  switch(category) {
    case '1':
      return HOME_POS;
    case '2':
      return POS1;
    case '3':
      return POS2;
    case '4':
      return POS3;
    case '5':
      return POS4;
    case '6':
      return POS5;  
  }

  return outputPos;
}
