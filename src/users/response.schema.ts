import {SchemaObject} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const GetUsersListSchema: SchemaObject = {
  type: 'object',
  properties: {
    is_success: {
      type: 'boolean',
    },
    message: {
      type: 'string',
    },
    users: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
          },
          name:{
            type:"string",
          },
          email:{
            type:'string',
          },
          password:{
            type:'string',
          },
          deleted_at:{
            type:'string'
          },
          created_at:{
            type:'string',
          },
        },
      },
    },
  },
};
