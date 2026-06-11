<?php

namespace App\Providers;

use App\Models\Activity\Activity;
use App\Models\Activity\Type\TypeActivity;
use App\Models\Bikes\Bike;
use App\Models\Bikes\Components\Components;
use App\Models\User;
use App\Observers\BikeObserver;
use App\Observers\ComponentsMultiBikeObserver;
use App\Policies\OwnsResource;
use App\Policies\SelfRessource;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (Session::has('locale')) {
            App::setLocale(Session::get('locale'));
        }
        Gate::policy(TypeActivity::class, OwnsResource::class);
        Gate::policy(Activity::class, OwnsResource::class);
        Gate::policy(Bike::class, OwnsResource::class);
        Gate::policy(Components::class, OwnsResource::class);
        Gate::policy(User::class, SelfRessource::class);
        Components::observe(ComponentsMultiBikeObserver::class);
        Bike::observe(BikeObserver::class);
    }
}
