export type RouteStatus = "CREATED" | "REQUESTED" | "OPERATED";

export interface RouteItem {
  id: string;
  from: string;
  to: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: RouteStatus;
}

export type RouteStop = {
  order: number;
  name: string;
  time: string;
  tag?: "탑승위치" | "하차위치";
};
