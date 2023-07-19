import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(
    private readonly configService: ConfigService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  private SERVER_URL = this.configService.get('SERVER_URL');
  private SERVER_PORT: number = +this.configService.get('SERVER_PORT') ?? 3001;

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.http.pingCheck(
          'toy-squad-server',
          `${this.SERVER_URL}:${this.SERVER_PORT}`,
        ),
    ]);
  }
}
