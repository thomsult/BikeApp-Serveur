<?php

namespace App\Enums;

enum TypeActivityFamily: string
{
    case Ride = 'ride';
    case Maintenance = 'maintenance';
    case Event = 'event';
    case Challenge = 'challenge';
    case Training = 'training';
    case Other = 'other';
}
