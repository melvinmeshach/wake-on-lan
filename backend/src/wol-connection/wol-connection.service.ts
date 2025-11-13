import { Injectable } from '@nestjs/common';

@Injectable()
export class WOLConnectionService {
  getStatus(): string {
    return 'NAS status';
  }
//   async isSshReachable(host, port = 22, timeout = 3000) {
//   return new Promise((resolve) => {
//     const socket = new net.Socket();

//     const onError = () => {
//       socket.destroy();
//       resolve(false);
//     };

//     socket.setTimeout(timeout);
//     socket.once('error', onError);
//     socket.once('timeout', onError);

//     socket.connect(port, host, () => {
//       socket.end();
//       resolve(true);
//     });
//   });
// }
}
