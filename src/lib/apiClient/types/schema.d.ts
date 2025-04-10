/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/v1/login': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['login'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/logout': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['auth.logout'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/register': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['auth.register'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/refresh': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['auth.refresh'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/tasks': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** タスク一覧取得 */
    get: operations['tasks.index'];
    put?: never;
    /** 新規タスク作成 */
    post: operations['tasks.store'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/tasks/{task}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** タスク単体取得 */
    get: operations['tasks.show'];
    /** タスク更新 */
    put: operations['tasks.update'];
    post?: never;
    /** タスク削除 */
    delete: operations['tasks.destroy'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/users/me': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 自身のユーザ取得 */
    get: operations['user.me'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/v1/users': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** ユーザ一覧取得 */
    get: operations['user.index'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    /** TaskResource */
    TaskResource: {
      id: number;
      title: string;
      description: string | null;
      created_user: components['schemas']['User'];
      assigned_users: components['schemas']['User'][];
      is_done: boolean;
    };
    /** User */
    User: {
      id: number;
      name: string;
      email: string;
      /** Format: date-time */
      email_verified_at: string | null;
      /** Format: date-time */
      created_at: string | null;
      /** Format: date-time */
      updated_at: string | null;
    };
    /** UserResource */
    UserResource: {
      id: number;
      name: string;
      email: string;
      /** Format: date-time */
      email_verified_at: string | null;
      /** Format: date-time */
      created_at: string | null;
      /** Format: date-time */
      updated_at: string | null;
    };
  };
  responses: {
    /** @description Validation error */
    ValidationException: {
      headers: {
        [name: string]: unknown;
      };
      content: {
        'application/json': {
          /** @description Errors overview. */
          message: string;
          /** @description A detailed description of each field that failed validation. */
          errors: {
            [key: string]: string[];
          };
        };
      };
    };
    /** @description Unauthenticated */
    AuthenticationException: {
      headers: {
        [name: string]: unknown;
      };
      content: {
        'application/json': {
          /** @description Error overview. */
          message: string;
        };
      };
    };
    /** @description Not found */
    ModelNotFoundException: {
      headers: {
        [name: string]: unknown;
      };
      content: {
        'application/json': {
          /** @description Error overview. */
          message: string;
        };
      };
    };
  };
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  login: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': string;
        };
      };
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            /** @example Unauthorized */
            error: string;
          };
        };
      };
    };
  };
  'auth.logout': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            /** @example Successfully logged out */
            message: string;
          };
        };
      };
    };
  };
  'auth.register': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          name: string;
          /** Format: email */
          email: string;
          password: string;
          password_confirmation: string;
        };
      };
    };
    responses: {
      201: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': string;
        };
      };
      422: components['responses']['ValidationException'];
    };
  };
  'auth.refresh': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            token: string;
          };
        };
      };
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            /** @example Token not provided */
            error: string;
          };
        };
      };
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            /** @example Could not refresh token */
            error: string;
            detail: string;
          };
        };
      };
    };
  };
  'tasks.index': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description return TaskResource::collection($tasks); */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': string;
        };
      };
      401: components['responses']['AuthenticationException'];
    };
  };
  'tasks.store': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          title: string;
          is_public: boolean;
          description?: string | null;
          assigned_user_ids?: number[] | null;
        };
      };
    };
    responses: {
      /** @description `TaskResource` */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['TaskResource'];
        };
      };
      401: components['responses']['AuthenticationException'];
      422: components['responses']['ValidationException'];
    };
  };
  'tasks.show': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description The task ID */
        task: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description `TaskResource` */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['TaskResource'];
        };
      };
      401: components['responses']['AuthenticationException'];
      404: components['responses']['ModelNotFoundException'];
    };
  };
  'tasks.update': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description The task ID */
        task: number;
      };
      cookie?: never;
    };
    requestBody?: {
      content: {
        'application/json': {
          title?: string;
          is_public?: boolean;
          description?: string | null;
          is_done?: boolean;
          assigned_user_ids?: number[] | null;
        };
      };
    };
    responses: {
      /** @description `TaskResource` */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['TaskResource'];
        };
      };
      401: components['responses']['AuthenticationException'];
      404: components['responses']['ModelNotFoundException'];
      422: components['responses']['ValidationException'];
    };
  };
  'tasks.destroy': {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description The task ID */
        task: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description No content */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': null;
        };
      };
      401: components['responses']['AuthenticationException'];
      404: components['responses']['ModelNotFoundException'];
    };
  };
  'user.me': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description `UserResource` */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            user: components['schemas']['UserResource'];
          };
        };
      };
      401: components['responses']['AuthenticationException'];
    };
  };
  'user.index': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            users: components['schemas']['UserResource'][];
          };
        };
      };
      401: components['responses']['AuthenticationException'];
    };
  };
}
