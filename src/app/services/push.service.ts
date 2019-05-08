/*
 * Developed by Mannini Andrea (https://github.com/manniniandrea). :bowtie:
 * Last modified 5/2/19 4:09 PM.
 * Copyright 2019-2019 Mannini Andrea (https://github.com/manniniandrea)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

import {Injectable} from '@angular/core';
//import {EchoService} from 'angular-laravel-echo';
//import {ChannelType} from 'angular-laravel-echo/src/services/lib.service';
import {Observable, Subscription} from 'rxjs';
//import {AuthQuery, AuthState} from './models/auth';
//import {NgxLogUnicornService} from 'ngx-log-unicorn';

@Injectable({
    providedIn: 'root',
})
export class PushService {

    private _notifications: Subscription = null;
    private _privateChannels: string[]   = [];

    constructor(//private _echo: EchoService,
                //private _authQuery: AuthQuery,
                //private _logger: NgxLogUnicornService
                ) {
                    console.log("PIPPO");
                 // console.log(this._echo.listen("private","NewDrumsData"));
//this._init();
    }
/*
    public listen(type: ChannelType, name: string, eventName: string): Observable<any> {
      
        this._echo.join(name, type);
        if (type === 'private') {
            this._privateChannels.push(name);
        }
        return this._echo.listen(name, eventName);
         // .pipe(share());
    }

    public leave(name: string) {
        this._echo.leave(name);
        let index;
        if ((index = this._privateChannels.indexOf(name)) >= 0) {
            this._privateChannels.splice(index, 1);
        }
    }

    private _leaveAll() {
        let channel;
        while ((channel = this._privateChannels.pop()) != null) {
            this.leave(channel);
        }
    }


    private _init() {
        this._authQuery.isLoggedIn$.subscribe(this._onLoginDataChange.bind(this));
    }
    private _onLoginDataChange() {
        this._updateSocketStatus(this._authQuery.getValue());
    }

    private _updateSocketStatus(data: AuthState) {
        this._logger.log(this, 'updateSocketStatus', data);
        if (data.user) {
            this._echo.login({
                ['Authorization']: `${data.token_type} ${data.token}`,
            }, data.user.id);
            this._notifications = this._echo.notification('*')
                .subscribe((notification) => {
                    this._logger.tag(this, [
                        'push',
                        'data',
                    ], 'Notification Received', notification);
                });
        } else {
            if (this._notifications) {
                this._notifications.unsubscribe();
                this._notifications = null;
            }
            this._leaveAll();
            this._echo.logout();
        }
    }
*/
  }
