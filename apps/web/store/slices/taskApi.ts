import type { Task } from "@/type/TaskType";
import baseApi from "../api/baseApi";

type TaskResponse = Task[];

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectTasks: builder.query<TaskResponse, string>({
      query: (projectId) => `/projects/${projectId}/tasks`,
      providesTags: (result, error, projectId) => 
        result
          ? [
              ...result.map((t: any) => ({ type: "Task" as const, id: t.id })),
              { type: "Task", id: `LIST-${projectId}` },
            ]
          : [{ type: "Task", id: `LIST-${projectId}` }],
    }),

    addTaskTimeEntry: builder.mutation<
      any,
      {
        projectId: string;
        taskId: string;
        data: { date: string; hours: number; note?: string };
      }
    >({
      query: ({ projectId, taskId, data }) => ({
        url: `/projects/${projectId}/tasks/${taskId}/time-entries`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { projectId, taskId }) => [
        { type: "Task", id: taskId },
        { type: "Task", id: `LIST-${projectId}` },
      ],
    }),

    createProjectTask: builder.mutation<Task, { projectId: string; data: any }>({
      query: ({ projectId, data }) => ({
        url: `/projects/${projectId}/tasks`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: { data: Task }, meta, arg) => response.data,
      // Pick out errors and prevent nested properties in a hook or selector
      transformErrorResponse: (
        response: { status: string | number },
        meta,
        arg,
      ) => response.status,
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Task", id: `LIST-${projectId}` },
      ],
    }),

    updateProjectTask: builder.mutation<
      any,
      { projectId: string; taskId: string; data: any }
    >({
      query: ({ projectId, taskId, data }) => ({
        url: `/projects/${projectId}/tasks/${taskId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { projectId, taskId }) => [
        { type: "Task", id: taskId },
        { type: "Task", id: `LIST-${projectId}` },
      ],
    }),

    deleteProjectTask: builder.mutation<
      any,
      { projectId: string; taskId: string }
    >({
      query: ({ projectId, taskId }) => ({
        url: `/projects/${projectId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId, taskId }) => [
        { type: "Task", id: taskId },
        { type: "Task", id: `LIST-${projectId}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProjectTasksQuery,
  useCreateProjectTaskMutation,
  useUpdateProjectTaskMutation,
  useDeleteProjectTaskMutation,
  useAddTaskTimeEntryMutation,
} = tasksApi;
