<?php

namespace App\Observers;

use App\Service\UploadService;

class BikeObserver
{
    public function deleting($bike)
    {
        UploadService::deleteFiles($bike, 'image_url');
    }
}
