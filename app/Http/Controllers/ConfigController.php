<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;

class ConfigController extends Controller
{
    private function getWelcomeImage(): array
    {
        return config('bikeapp.welcome_image', [
            [
                'url' => '1.webp',
                'credit' => '@sebastiangraserphotography',
                'hash' => 'LTJR:Q8_D%%1~WD$Rje..TbbIARk',
            ],
        ]);
    }

    private function allImages(): array
    {
        $imagesConfig = $this->getWelcomeImage();
        $locals = config('app.locale');

        foreach ($imagesConfig as &$image) {
            $image['credit_url'] = 'https://unsplash.com/'.$locals.'/'.$image['credit'];
            $image['url'] = asset('assets/images/onboarding/'.$image['url'], true);
        }

        return $imagesConfig;
    }

    public function welcome()
    {
        $imagesConfig = $this->allImages();

        return response()->json($imagesConfig);
    }

    public function image($filename)
    {

        $path = Storage::disk('public')->path('assets/images/onboarding/'.$filename);

        if (! file_exists($path)) {
            $path = Storage::disk('public')->path('assets/images/onboarding/'.'1.webp');
        }

        return response()->file($path);
    }

    public static function welcomeRandomImage()
    {
        $imagesConfig = config('bikeapp.welcome_image', [
            [
                'url' => '1.webp',
                'credit' => '@sebastiangraserphotography',
                'hash' => 'LTJR:Q8_D%%1~WD$Rje..TbbIARk',
            ],
        ]);

        $randomImage = $imagesConfig[array_rand($imagesConfig)];

        return 'assets/images/onboarding/'.basename($randomImage['url']).'';
    }
}
