export type RouteStatus = "APPROVED" | "CANCELLED" | "PENDING";

export interface RouteItem {
  id: string;
  from: string;
  to: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  endTime?: string;
  status?: RouteStatus;
}

export type RouteStop = {
  order: number;
  name: string;
  time: string;
  tag?: "탑승위치" | "하차위치";
};
