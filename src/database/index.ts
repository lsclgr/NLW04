import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  //verifica se e teste pra saber qual banco usar
  return createConnection(
    Object.assign(defaultOptions, {
      database:
        process.env.NODE_ENV === "test"
          ? "./src/database/database.test.sqlite"
          : defaultOptions.database,
    })
  );
};
