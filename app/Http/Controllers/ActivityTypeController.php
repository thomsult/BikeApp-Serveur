<?php

namespace App\Http\Controllers;

use App\Http\Resources\TypeActivityResource;
use App\Models\Activity\Type\TypeActivity;
use Illuminate\Http\Request;
use Illuminate\Validation\UnauthorizedException;

class ActivityTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $activityTypes = $user->typeActivities()->get(); // Récupérer les types d'activités de l'utilisateur

        return response()->json(TypeActivityResource::collection(
            $activityTypes
                ->sortBy('label') // Trier les types d'activités par label
                ->values() // Réindexer les clés après le tri
        ));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $validatedData = $request->validate([
            'label' => 'required|string|max:255',
            'family' => 'required|string|max:255',
            'color' => 'nullable|string|hex_color', // Assuming color is a hex code
        ]);
        $typeActivity = new TypeActivity($validatedData);
        $typeActivity->user()->associate($user);
        $typeActivity->save();

        return response()->json(['message' => 'Activity type created']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, TypeActivity $typeActivity)
    {
        return response()->json(TypeActivityResource::make($typeActivity));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TypeActivity $typeActivity)
    {
        $validatedData = $request->validate([
            'label' => 'sometimes|required|string|max:255',
            'family' => 'sometimes|required|string|max:255',
            'color' => 'sometimes|nullable|string|hex_color', // Assuming color is a hex code

        ]);
        $typeActivity->update($validatedData);

        return TypeActivityResource::make($typeActivity); // Retourner la ressource mise à jour
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, Request $request)
    {
        $activityType = TypeActivity::findOrFail($id);
        if ($activityType->is_default) {
            throw new UnauthorizedException(__('validation.cannot_delete_default_activity_type'), 403);
        }
        $activityType->delete();

        return response()->json(['message' => 'Activity type deleted']);
    }
}
