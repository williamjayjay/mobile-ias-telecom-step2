import z from "zod";

const taskSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string().min(1, 'A descrição é obrigatória'),
});

type TaskFormData = z.infer<typeof taskSchema>;


export { taskSchema, TaskFormData };
