export default class CustomError extends Error {
  status: string = 'error';
  message: any;
  httpCode: any;
  internalCode: any;
  data: any;

  constructor({ message, httpCode, internalCode, data }) {
    super();
    this.message = message ?? 'Fallo en el servidor';
    this.httpCode = httpCode ?? 500;
    this.internalCode = internalCode ?? 0;
    this.data = data;
  }

  static SERVER_ERROR = new CustomError({
    message: 'Ocurrió un error interno en el servidor',
    httpCode: 500,
    internalCode: 1,
    data: null
  });

  static AUTH_ERROR = new CustomError({
    message: 'No autorizado',
    httpCode: 401,
    internalCode: 2,
    data: null
  });

  static TOKEN_ERROR = new CustomError({
    message: 'Token no válida',
    httpCode: 498,
    internalCode: 3,
    data: null
  });

  static USER_NOT_FOUND = new CustomError({
    message: 'Usuario no encontrado',
    httpCode: 404,
    internalCode: 4,
    data: null
  });

  static ROLE_ERROR = new CustomError({
    message: 'No tiene los permisos suficientes',
    httpCode: 401,
    internalCode: 5,
    data: null
  });

  static REQUIRED_DATA = new CustomError({
    message: 'Faltan parámetros requeridos',
    httpCode: 400,
    internalCode: 6,
    data: null
  });

  static DUP_DATA = new CustomError({
    message: 'Datos duplicados',
    httpCode: 401,
    internalCode: 7,
    data: null
  });

  static PROJECT_NOT_FOUND = new CustomError({
    message: 'Proyecto no encontrado',
    httpCode: 404,
    internalCode: 8,
    data: null
  });

  static FILE_NOT_FOUND = new CustomError({
    message: 'Archivo no encontrado',
    httpCode: 404,
    internalCode: 9,
    data: null
  });

  static CATEGORY_NOT_FOUND = new CustomError({
    message: 'Categoria no encontrada',
    httpCode: 404,
    internalCode: 10,
    data: null
  });

  static EXISTING_REPO = new CustomError({
    message: 'Ya existe un repositorio de código para este proyecto',
    httpCode: 400,
    internalCode: 11,
    data: null
  });

  static REPO_NOT_FOUND = new CustomError({
    message: 'El repositorio no existe',
    httpCode: 404,
    internalCode: 12,
    data: null
  });

  static NOT_VALID_VALUE = new CustomError({
    message: 'Se ingreso un valor no válido para uno de los campos',
    httpCode: 400,
    internalCode: 13,
    data: null
  });

  static LINK_NOT_FOUND = new CustomError({
    message: 'El recurso solicitado no existe',
    httpCode: 404,
    internalCode: 12,
    data: null
  });
}
