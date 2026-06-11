<?php

namespace App\Http\Controllers;

use App\Http\Requests\BikeComponentsRequest;
use App\Http\Resources\Bikes\Components\ComponentsResource;
use App\Models\Bikes\Components\Components;
use App\Service\ComponentService;
use DomainException;
use Illuminate\Http\Request;

class ComponentsBikeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if (! $user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }

        return response()->json(
            ComponentsResource::collection($user->components()->with(['type', 'brand'])->get())
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BikeComponentsRequest $request)
    {
        $data = $request->validated();
        $createdComponents = $request->user()->components()->create($data);

        return response()->json(ComponentsResource::make($createdComponents->load(['type', 'brand'])));
    }

    /**
     * Display the specified resource.
     */
    public function show(Components $component)
    {
        return response()->json([
            ComponentsResource::make($component->load(['type', 'brand'])),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BikeComponentsRequest $request, Components $component)
    {
        $updatedComponents = $component->load(['type', 'brand']);
        $data = $request->validated();
        $updatedComponents->update($data);
        $updatedComponents->refresh();

        return response()->json(ComponentsResource::make($updatedComponents));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Components $component)
    {
        try {
            ComponentService::validateMultipleBikesDelete($component);
            $component->delete();
        } catch (DomainException $e) {
            return response()->json([
                'message' => 'Cannot delete component',
                'errors' => [
                    'multiBike' => [$e->getMessage()],
                ],
            ], 422);
        }

        return response()->json([
            'message' => 'ComponentsBikeController destroy method - deleted successfully',
            'id' => $component->id,
        ]);
    }
}
