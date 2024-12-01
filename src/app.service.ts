import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  private getHello2(arg1: string, arg2: string): string {
    return arg1;
  }
}
