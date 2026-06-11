<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChallengeRequest;
use App\Http\Resources\Challenge\ChallengeResource;
use App\Models\Challenge;

class ChallengeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $challenges = request()->user()->challenges()->get();

        return response()->json(ChallengeResource::collection($challenges));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ChallengeRequest $request)
    {
        $data = $request->validated();
        $challenge = $request->user()->challenges()->create($data);

        return response()->json(ChallengeResource::make($challenge));
    }

    /**
     * Display the specified resource.
     */
    public function show(Challenge $challenge)
    {
        return response()->json(ChallengeResource::make($challenge));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ChallengeRequest $request, Challenge $challenge)
    {
        $data = $request->validated();
        $challenge->update($data);

        return response()->json(ChallengeResource::make($challenge));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Challenge $challenge)
    {
        request()->user()->challenges()->where('id', $challenge->id)->delete();

        return response()->json(null, status: 204);
    }
}
