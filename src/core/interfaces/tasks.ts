import { TaskStatus } from "../enums/task";

interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
}

export { ITask }
