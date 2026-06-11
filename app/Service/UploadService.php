<?php

namespace App\Service;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadService
{
    private const DISK = 'private';

    public static function deleteFiles(Model $model, string $attribute)
    {
        if (empty($model->$attribute)) {
            return;
        }
        if (Storage::disk(self::DISK)->exists($model->$attribute)) {
            Storage::disk(self::DISK)->delete($model->$attribute);
        }
    }

    public static function storeFiles(User $user, string $type, string $file, string $ext): string
    {
        $userId = $user->id;

        $file_name = Str::uuid().'.'.$ext;
        Storage::disk(self::DISK)->put("/upload/{$userId}/".$type.'/'.$file_name, $file);

        $pathName = "upload/{$userId}/".$type.'/'.$file_name;

        return $pathName;
    }

    public static function getFiles(User $user, string $path, string $filename)
    {
        return Storage::disk(self::DISK)->path("/upload/{$user->id}/{$path}/{$filename}");
    }
}
