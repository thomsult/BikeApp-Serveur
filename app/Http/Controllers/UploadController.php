<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Service\UploadService;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        $data = $request->validate([
            'file' => 'required|string',
            'ext' => 'required|in:jpg,jpeg,png,gif,webp',
            'type' => 'required|in:bike,ride,component',
        ]);

        if (strlen($data['file']) > 10 * 1024 * 1024) {
            abort(413, 'File too large');
        }

        $file = base64_decode($data['file']);

        $finfo = finfo_open();
        $mime = finfo_buffer($finfo, $file, FILEINFO_MIME_TYPE);

        if (! str_starts_with($mime, 'image/')) {
            abort(422, 'Invalid image');
        }

        $pathName = UploadService::storeFiles(request()->user(), $data['type'], $file, $data['ext']);

        return response()->json(['path' => $pathName], 201);
    }

    public function download(Request $request, User $user, $path, $filename)
    {
        $fullPath = UploadService::getFiles($user, $path, $filename);

        if (! $fullPath || ! file_exists($fullPath)) {
            abort(404, 'File not found');
        }

        return response()->download($fullPath, $filename);
    }
}
