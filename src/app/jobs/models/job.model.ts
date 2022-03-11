export interface Job {
  id?: number;
  title: string;
  info?: string;
  likes?: number;
  type?: string;
  category?: string;
  applied?: number[];
  createdBy?: number;
}
