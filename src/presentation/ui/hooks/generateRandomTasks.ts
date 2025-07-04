import { titlesMock, descriptionTemplatesMock } from "@/core/constants/mockTasks";
import { TaskStatus } from "@/core/enums/task";
import { ITask } from "@/core/interfaces/tasks";
import uuid from 'react-native-uuid';

export function generateRandomTasks(count = 50): ITask[] {
  const tasks: ITask[] = [];

  for (let i = 0; i < count; i++) {
    const title = titlesMock[Math.floor(Math.random() * titlesMock.length)];
    const template = descriptionTemplatesMock[Math.floor(Math.random() * descriptionTemplatesMock.length)];
    const description = template.replace('{title}', title);

    const newUUID = uuid.v4();

    const task: ITask = {
      id: newUUID,
      title,
      description,
      status: TaskStatus.Pendente,
      createdAt: new Date().toISOString(),
    };

    tasks.push(task);
  }

  return tasks;
}
