import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    pp(lang: string, res: Response): {
        api_url: string;
        lang: string;
    };
    cgu(lang: string, res: Response): {
        api_url: string;
        lang: string;
    };
}
