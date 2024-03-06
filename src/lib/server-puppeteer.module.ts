import { Module } from '@nestjs/common';
import { moduleFactory } from '@onivoro/server-common';
import { Browser } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { ServerPuppeteerConfig } from './classes/server-puppeteer-config.class';
import { PuppeteerService } from './services/puppeteer.service';

let browser: Browser | null = null;

@Module({})
export class ServerPuppeteerModule {
  static configure(serverPuppeteerConfig: ServerPuppeteerConfig) {
    return moduleFactory({
      module: ServerPuppeteerModule,
      providers: [
        {
          provide: ServerPuppeteerConfig,
          useValue: serverPuppeteerConfig
        },
        {
          provide: Browser,
          useFactory: async (options: ServerPuppeteerConfig) => {
            if (!browser) {
              puppeteer.use(StealthPlugin())
              browser = await puppeteer.launch(options);
            }

            return browser;
          },
          inject: [ServerPuppeteerConfig]
        },
        PuppeteerService
      ]
    });
  }
}
