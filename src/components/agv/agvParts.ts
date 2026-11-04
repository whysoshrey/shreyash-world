/**
 * Parts of the ACME robot, as shown in the 3D model.
 *
 * Every line here is taken from the ACME dissertation (NIFT Delhi, May 2024) or is visible in the
 * build photos and prototype video. Where the two differ, the note says which one a detail comes from.
 */

export type LayerKey = "drive" | "chassis" | "electronicsPlate" | "electronics" | "deck" | "payload" | "enclosure" | "sensors";

export type AgvPart = {
  id: string;
  name: string;
  layer: LayerKey;
  /** short group label for the parts list */
  group: "Structure" | "Drive" | "Control" | "Sensing" | "Operator";
  body: string;
  spec?: string;
};

export const AGV_PARTS: AgvPart[] = [
  {
    id: "wheelPlate",
    name: "Wheel plate",
    layer: "chassis",
    group: "Structure",
    body: "The base of the robot. All four drive motors bolt to it, and the corners are cut back to clear the wheels.",
    spec: "4 mm aluminium, CNC laser-cut from AutoCAD drawings · M8 bolts for the main supports, M2 elsewhere",
  },
  {
    id: "motors",
    name: "Drive motors (×4)",
    layer: "drive",
    group: "Drive",
    body:
      "Four 12 V geared DC motors, two per side. The dissertation sizes them for a 25 kg moving mass (20 kg payload plus about 5 kg of robot). Eight motors burned out in testing when misaligned gearboxes loaded the shafts sideways.",
    spec: "Per motor: 2.5 Nm stall, 1.875 Nm rated (calculated) · about 0.2 m/s loaded (40 RPM)",
  },
  {
    id: "wheels",
    name: "Wheels (×4)",
    layer: "drive",
    group: "Drive",
    body: "Two wheels per side. The radius was set by availability, strength and ground clearance. The build uses yellow omni-style wheels with rollers, as seen in the photos and video.",
    spec: "5 cm radius",
  },
  {
    id: "caster",
    name: "Centre support caster",
    layer: "chassis",
    group: "Drive",
    body:
      "The fix for the burned motors. A caster at the centre takes the payload's weight off the motor shafts. Ball bearings between shaft and hub would also work, but there was no room for them.",
  },
  {
    id: "electronicsPlate",
    name: "Electronics plate",
    layer: "electronicsPlate",
    group: "Structure",
    body: "Carries the boards, battery and wiring. All grounds share one common line.",
    spec: "1 mm stainless steel, laser-cut",
  },
  {
    id: "mega",
    name: "Arduino Mega 2560",
    layer: "electronics",
    group: "Control",
    body:
      "Runs the motors and reads the line sensor, ultrasonic sensor and servo. It replaced the Arduino Uno of the first prototype, which ran out of pins and computing power. Written in C++ in VS Code with PlatformIO.",
    spec: "Motor driver on pins 8–11 · line sensor on A0–A4 · ultrasonic on 6/7 · servo on 3",
  },
  {
    id: "esp",
    name: "ESP32 Wi-Fi module",
    layer: "electronics",
    group: "Control",
    body:
      "Hosts the robot's own Wi-Fi network and the web page an operator uses to call it to a station. It reads the RFID reader and drives the LCD, and passes movement commands (straight, left, right, stop) to the Mega over serial.",
  },
  {
    id: "driver",
    name: "Motor driver",
    layer: "electronics",
    group: "Control",
    body: "Switches the four motors forward and back on the Mega's commands, from the 12 V supply.",
    spec: "Inputs IN1–IN4 on Mega pins 8–11",
  },
  {
    id: "buck",
    name: "Buck converter",
    layer: "electronics",
    group: "Control",
    body: "Steps the 12 V battery down to 5 V for the Mega, while 12 V goes straight to the motor driver.",
  },
  {
    id: "battery",
    name: "Battery",
    layer: "electronics",
    group: "Control",
    body: "Sized in the dissertation from about 20 W of total draw (four motors at 12 V and 0.3 A, plus a buffer) for two to three hours of running.",
    spec: "12 V · 5 Ah",
  },
  {
    id: "deck",
    name: "Pink acrylic deck",
    layer: "deck",
    group: "Structure",
    body: "The middle layer between the electronics and the payload deck. The LCD and the front sensors mount along its front edge. Visible in the build photos and video.",
  },
  {
    id: "payload",
    name: "Payload deck",
    layer: "payload",
    group: "Structure",
    body: "Carries the crate of cut bundles. The deck size came from estimating the carton a 20 kg load of cut pieces needs.",
    spec: "Two 4 mm aluminium plates (8 mm) · rated for 20 kg",
  },
  {
    id: "enclosure",
    name: "Clear enclosure",
    layer: "enclosure",
    group: "Structure",
    body:
      "The outer casing, with arches cut for the wheels and a bolted lid. The dissertation specifies a metal core with a plastic casing; the build uses clear acrylic, so the electronics stay visible.",
  },
  {
    id: "rfid",
    name: "RFID reader (PN532)",
    layer: "sensors",
    group: "Sensing",
    body:
      "Reads the RFID tags placed on the floor at junctions and stations. Each tag tells the robot where it is; a lookup table turns 'where I am' and 'where I'm going' into the next move. It had to sit away from the aluminium plates, which detuned its signal.",
    spec: "I²C to the ESP32",
  },
  {
    id: "lineSensor",
    name: "5-channel line sensor",
    layer: "chassis",
    group: "Sensing",
    body: "Keeps the robot on the black line painted along the route. Its steering response was tuned through the proportional (Kp) gain.",
    spec: "Waveshare 5-channel IR array · analog pins A0–A4",
  },
  {
    id: "ultrasonic",
    name: "Ultrasonic sensor on a servo",
    layer: "sensors",
    group: "Sensing",
    body: "Detects obstacles ahead. A small servo turns the sensor to widen what it can see; on detection the robot stops.",
    spec: "HC-SR04 on an SG-90 servo",
  },
  {
    id: "lcd",
    name: "Status display",
    layer: "deck",
    group: "Operator",
    body: "A two-line display that shows where the robot is and where it is going (in the video: 'Current Location' and 'Final Loc: Home').",
    spec: "16-character × 2-line LCD on I²C",
  },
  {
    id: "kill",
    name: "Kill switch",
    layer: "sensors",
    group: "Operator",
    body: "An emergency shutdown on the front face, one of the robot's eight required functions.",
  },
];

export const PART_BY_ID: Record<string, AgvPart> = Object.fromEntries(AGV_PARTS.map((p) => [p.id, p]));

/** How far each layer lifts in the exploded view (cm). */
export const EXPLODE: Record<LayerKey, number> = {
  drive: 0,
  chassis: 0,
  electronicsPlate: 9,
  electronics: 15,
  deck: 24,
  payload: 33,
  enclosure: 42,
  sensors: 42,
};
