import swaggerJsdoc from "swagger-jsdoc";

const port = process.env.port || 8000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "notesAPI",
      version: "0.0.2",
    },
    servers: [
      {
        url: `http://localhost:${port}/api/v1/`,
      },
    ],
  },
  requestInterceptor: (request: any) => {
    request.headers.Origin = `http://localhost:${port}`;
    return request;
  },
  apis: ["./dist/routes/*.js"],
};

export const specs = swaggerJsdoc(options);
