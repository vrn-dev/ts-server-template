export interface Config {
  // Stub Config
  port: string;
  db: DB;
  server: Server;
}

export interface Server {
  port: string;
  jwtKey: string;
}

export interface DB {
  replicaSet: boolean;
  retryTime: number;
  single: {
    uri: string;
    testUri: string;
    name: string;
    hostname: string;
    port: string;
  };
  replica: {
    primaryHost: string;
    primaryPort: string;
    uris: string[];
    replSetName: string;
  };
}
