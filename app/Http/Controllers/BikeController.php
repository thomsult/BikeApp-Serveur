<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateBikeRequest;
use App\Http\Resources\Bikes\BikeResource;
use App\Http\Resources\Bikes\BikeTypeResource;
use App\Models\Bikes\Bike;
use App\Models\Bikes\TypeBike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\UnauthorizedException;

class BikeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $bikes = $user->bikes()
            ->with('type', 'stats.service', 'components')
            ->get();

        return response()->json(BikeResource::collection($bikes));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateBikeRequest $request)
    {
        $user = $request->user();

        return DB::transaction(function () use ($request, $user) {
            $data = $request->validated();
            $bike = $user->bikes()->create($data);

            $stats = $bike->stats()->create($data['stats']);
            $stats->service()->create($data['stats']['service']);
            $bike->components()->sync($data['components'] ?? []);

            return response()->json(BikeResource::make($bike));
        });

    }

    /**
     * Display the specified resource.
     */
    public function show(Bike $bike, Request $request)
    {
        $user = $request->user();
        if ($user->cannot('view', $bike)) {
            throw new UnauthorizedException(__('validation.unauthorized'), 403);
        }
        $bike->load('type', 'stats.service', 'components');

        return response()->json(BikeResource::make($bike));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CreateBikeRequest $request, Bike $bike)
    {
        $user = $request->user();

        if ($user->cannot('update', $bike)) {
            throw new UnauthorizedException(__('validation.unauthorized'), 403);
        }

        return DB::transaction(function () use ($request, $bike) {

            $data = $request->validated();

            $bike->update($data);

            $stats = $bike->stats()->updateOrCreate(
                ['bike_id' => $bike->id],
                $data['stats']
            );

            $stats->service()->updateOrCreate(
                ['stat_bike_id' => $stats->id],
                $data['stats']['service']
            );
            $bike->components()->sync($data['components'] ?? []);

            return response()->json(
                BikeResource::make($bike->refresh())
            );
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bike $bike, Request $request)
    {
        $user = $request->user();
        if ($user->cannot('delete', $bike)) {
            throw new UnauthorizedException(__('validation.unauthorized'), 403);
        }

        $bike->delete();

        return response()->json([
            'message' => 'Bike deleted successfully',
            'id' => $bike->id,
        ]);
    }

    public function getTypeBikeIndex()
    {
        $types = TypeBike::all();

        return response()->json(BikeTypeResource::collection($types));
    }

    public function getTypeBikeShow($typeBike)
    {
        $type = TypeBike::findOrFail($typeBike);

        return response()->json(BikeTypeResource::make($type));
    }
}
