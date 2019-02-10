import { DB } from '../types/config.types';
import { connect, connection } from 'mongoose';
import NetcatClient from 'netcat/client';

let uri = '';
let retryTime = 0;
const opts = {
  useCreateIndex: true,
  useNewUrlParser: true,
};

function uriBuilder(db: DB) {
  const isReplSet = db.replicaSet;
  if (isReplSet) {
    uri = `mongodb://${db.replica.uris.join(',')}`;
  } else {
    uri = `mongodb://${db.single.hostname}:${db.single.port}/${db.single.name}`;
  }

  if (uri) {
    return uri;
  } else {
    throw new Error('could not build mongo URI');
  }
}

function checkPort(host: string, port: string) {
  const nc = new NetcatClient();
  return new Promise(resolve => {
    const inter = setTimeout(() => {
      console.log('Checking if port is open...');
      nc.addr(host).scan(`${port}-${port}`, function(_port: { [key: string]: string }) {
        if (_port[port] === 'open') {
          console.log('port is open!');
          clearInterval(inter);
        }
      });
    }, 1000);
    resolve(true);
  });
}

export async function mongoConnect({ db }: { db: DB }) {
  connection.on('disconnected', async () => {
    console.error('disconnected from ', uri);

    setTimeout(async () => {
      try {
        console.log('RETRYING...');
        await connect(
          uri,
          opts,
        );
        console.log('reconnected to', uri);
      } catch (e) {}
    }, retryTime);
  });

  try {
    uri = uriBuilder(db);
    retryTime = db.retryTime;
    await connect(
      uri,
      opts,
    );
    console.log('connected to', uri);
  } catch (e) {
    console.error('could not connect to', uri);
  }
}
