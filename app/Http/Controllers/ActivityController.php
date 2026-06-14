<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateActivityRequest;
use App\Http\Requests\UpdateActivityRequest;
use App\Http\Resources\Activity\ActivityResource;
use App\Models\Activity\Activity;
use App\Models\Activity\ActivityEvent;
use App\Models\Activity\ActivityMaintenance;
use App\Models\Activity\ActivityOther;
use App\Models\Activity\ActivityRide;
use App\Models\Activity\ActivityTraining;
use App\Models\ActivitySnapshot;
use App\Models\Bikes\Bike;
use App\Models\Bikes\Components\Components;
use App\Service\DeepLinksHelper;
use Illuminate\Http\Request;
use Illuminate\Validation\UnauthorizedException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ActivityController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Activity::class, 'activity');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $activities = $request->user()
            ->activities()
            ->with([
                'typeActivity',
                'rideable' => fn ($morphTo) => $morphTo->morphWith([
                    Bike::class => [],
                    Components::class => [],
                ]),
            ])
            ->withFamily()
            ->get();

        return response()->json(ActivityResource::collection($activities));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateActivityRequest $request)
    {
        try {
            $data = $request->validated();
            $classActivity = $data['class'] ?? Activity::class;
            $activity = $classActivity::create(
                ['user_id' => $request->user()->id, ...$data,

                ]
            );
            if ($data['bike_id'] ?? null) {

                $activity->rideable()->associate(Bike::find($data['bike_id']));

            } elseif ($data['equipment_id'] ?? null) {
                $activity->rideable()->associate(Components::find($data['equipment_id']));
            }
            $activity->load('rideable');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error creating activity', 'error' => $e->getMessage()], 500);
        }

        return response()->json(ActivityResource::make($activity));

    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Activity $activity)
    {
        return response()->json(ActivityResource::make($activity));

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateActivityRequest $request, Activity $activity)
    {
        $data = $request->validated();

        $activity->update([
            ...$data,
            'version' => $activity->version + 1,
        ]);

        if ($data['bike_id'] ?? null) {

            $activity->rideable()->associate(Bike::find($data['bike_id']));

        } elseif ($data['equipment_id'] ?? null) {
            $activity->rideable()->associate(Components::find($data['equipment_id']));
        } else {
            $activity->rideable()->dissociate();
        }
        $activity->save();
        $activity->refresh();

        return response()->json(ActivityResource::make($activity));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Activity $activity)
    {
        $activity->delete();

        return response()->json([
            'message' => "Activity deleted for id: {$activity->id}",
        ]);
    }

    public function share(Request $request, Activity $activity)
    {
        $user = $request->user();
        $snapshot = $user->activitySnapshots()
            ->where('original_id', $activity->id)
            ->first();
        if ($snapshot->original_version !== $activity->version) {
            $snapshot->update([
                'data' => ActivitySnapshot::generateSnapshotData($activity),
                'original_version' => $activity->version,
                'token' => ActivitySnapshot::generateUniqueToken(),
            ]);
        }

        if (! $snapshot) {
            $snapshot = $user->activitySnapshots()->create([
                'original_id' => $activity->id,
                'token' => ActivitySnapshot::generateUniqueToken(),
                'data' => ActivitySnapshot::generateSnapshotData($activity),
            ]);
        }
        $shareLink = $snapshot->token;

        return response()->json([
            'shareLink' => DeepLinksHelper::generateShareUrl($activity->family(), $shareLink),
        ]);
    }

    public function openShareLink(Request $request, $token)
    {
        $user = $request->user();

        if (! $token || ! $user) {
            throw new UnauthorizedException(__('validation.token_required'));
        }

        $snapshot = ActivitySnapshot::where('token', $token)->first();

        if (! $snapshot) {
            throw new NotFoundHttpException(__('validation.share_link.invalid'));
        }
        if ($snapshot->original_owner_id === $user->id) {

            return response()->json(ActivityResource::make(Activity::find($snapshot->original_id)->withFamily()->first()));
        }
        $class = match ($snapshot->data['type_family'] ?? null) {
            'ride' => ActivityRide::class,
            'training' => ActivityTraining::class,
            'maintenance' => ActivityMaintenance::class,
            'event' => ActivityEvent::class,
            'other' => ActivityOther::class,
            default => Activity::class,
        };

        $newActivity = new $class([
            ...$snapshot->data,
            'user_id' => $user->id,
        ]);
        $newActivity->family = $snapshot->data['type_family'] ?? null;

        $newActivity->user_id = $user->id;

        return response()->json(ActivityResource::make($newActivity));
    }
}
