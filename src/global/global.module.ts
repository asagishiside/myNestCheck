import { HttpModule } from '@nestjs/axios';
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  imports: [HttpModule],
  exports: [HttpModule],
})
export class GlobalModule {}
