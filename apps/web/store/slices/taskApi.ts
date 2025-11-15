import baseApi from "../api/baseApi";

export const invoicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectTasks: builder.query<any[], string>({
      // projectId
      query: (projectId) => `/projects/${projectId}/tasks`,
      providesTags: (result, error, projectId) =>
        result
          ? [
              ...result.map((t: any) => ({ type: "Task" as const, id: t.id })),
              { type: "Task", id: `LIST-${projectId}` },
            ]
          : [{ type: "Task", id: `LIST-${projectId}` }],
    }),

    createProjectTask: builder.mutation<any, { projectId: string; data: any }>({
      query: ({ projectId, data }) => ({
        url: `/projects/${projectId}/tasks`,
        method: "POST",
        body: data,
      }),
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
} = invoicesApi;
