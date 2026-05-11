// clientsApi — все запросы к API через RTK Query
//
// Queries  (чтение):  getClients, getClientById
// Mutations (запись): deleteClient, updateClient, addClient

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Client } from '@/types/client';

export const clientsApi = createApi({
  reducerPath: 'clientsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001' }),
  tagTypes: ['Client'],

  endpoints: (builder) => ({
    // GET /users — список всех клиентов
    getClients: builder.query<Client[], void>({
      query: () => '/users',
      providesTags: ['Client'],
    }),

    // GET /users/:id — один клиент по id
    getClientById: builder.query<Client, string>({
      query: (id) => `/users/${id}`,
      providesTags: ['Client'],
    }),

    // DELETE /users/:id — удалить клиента
    deleteClient: builder.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Client'], // после удаления — список обновится
    }),

    // PUT /users/:id — обновить данные клиента
    // Принимает id и частичные данные клиента (только изменённые поля)
    updateClient: builder.mutation<Client, { id: string; data: Partial<Client> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Client'],
    }),

    // POST /users — добавить нового клиента
    addClient: builder.mutation<Client, Omit<Client, 'id'>>({
      query: (data) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Client'],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useDeleteClientMutation,
  useUpdateClientMutation,
  useAddClientMutation,
} = clientsApi;