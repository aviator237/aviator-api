import { Controller, Get, Param, Render, Res, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipAuth } from './decorators/skip-auth.decorator';


@Controller("api")
export class AppController {
  constructor(private readonly appService: AppService) { }

  @SkipAuth()
  @Get("politique-de-confidentialite/:lang")
  @Render('politique-de-confidentialite.hbs')
  pp(
    @Param("lang") lang: string,
    @Res() res: Response
  ) {

    return { api_url: process.env.SERVER_URI, lang };
  }

  @SkipAuth()
  @Get("conditions-generales-d-utilisation/:lang")
  @Render('conditions-generales-d-utilisation.hbs')
  cgu(
    @Param("lang") lang: string,
    @Res() res: Response
  ) {
    return { api_url: process.env.SERVER_URI, lang };

    // return res.render(
    //   "",
    //   { message: 'Hello world!' },
    // );
  }

}
