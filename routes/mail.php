<?php

use App\Mail\TestMail;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;

Artisan::command('mail:send-test', function () {

    $this->comment('Sending a test email...');
    Mail::to('thomsult+bikeapp@gmail.com')->send(new TestMail);
})->purpose('Send a test email');
