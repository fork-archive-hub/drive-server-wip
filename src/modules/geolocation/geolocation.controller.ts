import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { GeolocationService } from './geolocation.service';
@ApiTags('Geolocation')
@Controller('geolocation')
export class GeolocationController {
  constructor(private geolocationService: GeolocationService) {}

  @Post('/')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get Geolocation by ip',
  })
  @ApiOkResponse({ description: 'Get geolocation by ip' })
  @Public()
  async getLocation(@Body('ip') ip: string) {
    const location: any = await this.geolocationService.getLocation(ip);
    return {
      country: location.country,
      region: location.region,
      city: location.city,
      timezone: location.timezone,
    };
  }
}
