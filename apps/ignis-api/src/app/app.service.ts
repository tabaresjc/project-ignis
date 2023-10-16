import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { ts: number } {
    return ({ ts: new Date().getTime() });
  }
}
