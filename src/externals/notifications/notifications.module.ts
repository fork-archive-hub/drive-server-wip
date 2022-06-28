import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ConfigModule } from '@nestjs/config';
import { NotificationListener } from './listeners/notification.listener';
import { HttpClientModule } from '../http/http.module';
import { MailerModule } from '../mailer/mailer.module';
import { SendLinkListener } from './listeners/send-link.listener';
import { AnalyticsListener } from './listeners/analytics.listener';
@Module({
  imports: [ConfigModule, HttpClientModule, MailerModule],
  controllers: [],
  providers: [
    NotificationService,
    NotificationListener,
    AnalyticsListener,
    SendLinkListener,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
