<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property string $token
 * @property int $original_owner_id
 * @property array<array-key, mixed> $data
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $original_id
 * @property int $original_version
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySnapshot newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySnapshot newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySnapshot query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySnapshot whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySnapshot whereData($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySnapshot whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySnapshot whereOriginalId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySnapshot whereOriginalOwnerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySnapshot whereOriginalVersion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySnapshot whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivitySnapshot whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperActivitySnapshot {}
}

namespace App\Models\Activity{
/**
 * @property int $id
 * @property int $user_id
 * @property int|null $type_id
 * @property string $title
 * @property string|null $description
 * @property string $recurrence_frequency
 * @property int|null $recurrence_interval
 * @property \Illuminate\Support\Carbon $dt_start
 * @property \Illuminate\Support\Carbon|null $dt_end
 * @property string|null $location
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property float|null $distance
 * @property int|null $duration
 * @property \Illuminate\Support\Carbon|null $started_at
 * @property \Illuminate\Support\Carbon|null $stopped_at
 * @property string|null $training_type
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $rideable_type
 * @property int|null $rideable_id
 * @property string|null $waypoints
 * @property numeric|null $average_speed
 * @property numeric|null $max_speed
 * @property string|null $image_url
 * @property int $version
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent|null $rideable
 * @property-read \App\Models\Activity\Type\TypeActivity|null $typeActivity
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereAverageSpeed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereCompletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereDistance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereDtEnd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereDtStart($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereDuration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereImageUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereMaxSpeed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereRecurrenceFrequency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereRecurrenceInterval($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereRideableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereRideableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereStartedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereStoppedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereTrainingType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereVersion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity whereWaypoints($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Activity withFamily()
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperActivity {}
}

namespace App\Models\Activity{
/**
 * @property int $id
 * @property int $user_id
 * @property int|null $type_id
 * @property string $title
 * @property string|null $description
 * @property string $recurrence_frequency
 * @property int|null $recurrence_interval
 * @property \Illuminate\Support\Carbon $dt_start
 * @property \Illuminate\Support\Carbon|null $dt_end
 * @property string|null $location
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property float|null $distance
 * @property int|null $duration
 * @property \Illuminate\Support\Carbon|null $started_at
 * @property \Illuminate\Support\Carbon|null $stopped_at
 * @property string|null $training_type
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $rideable_type
 * @property int|null $rideable_id
 * @property string|null $waypoints
 * @property numeric|null $average_speed
 * @property numeric|null $max_speed
 * @property string|null $image_url
 * @property int $version
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereAverageSpeed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereCompletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereDistance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereDtEnd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereDtStart($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereDuration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereImageUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereMaxSpeed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereRecurrenceFrequency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereRecurrenceInterval($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereRideableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereRideableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereStartedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereStoppedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereTrainingType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereVersion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent whereWaypoints($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityEvent withFamily()
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperActivityEvent {}
}

namespace App\Models\Activity{
/**
 * @property int $id
 * @property int $user_id
 * @property int|null $type_id
 * @property string $title
 * @property string|null $description
 * @property string $recurrence_frequency
 * @property int|null $recurrence_interval
 * @property \Illuminate\Support\Carbon $dt_start
 * @property \Illuminate\Support\Carbon|null $dt_end
 * @property string|null $location
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property float|null $distance
 * @property int|null $duration
 * @property \Illuminate\Support\Carbon|null $started_at
 * @property \Illuminate\Support\Carbon|null $stopped_at
 * @property string|null $training_type
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $rideable_type
 * @property int|null $rideable_id
 * @property string|null $waypoints
 * @property numeric|null $average_speed
 * @property numeric|null $max_speed
 * @property string|null $image_url
 * @property int $version
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereAverageSpeed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereCompletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereDistance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereDtEnd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereDtStart($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereDuration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereImageUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereMaxSpeed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereRecurrenceFrequency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereRecurrenceInterval($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereRideableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereRideableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereStartedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereStoppedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereTrainingType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereVersion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance whereWaypoints($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityMaintenance withFamily()
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperActivityMaintenance {}
}

namespace App\Models\Activity{
/**
 * @property int $id
 * @property int $user_id
 * @property int|null $type_id
 * @property string $title
 * @property string|null $description
 * @property string $recurrence_frequency
 * @property int|null $recurrence_interval
 * @property \Illuminate\Support\Carbon $dt_start
 * @property \Illuminate\Support\Carbon|null $dt_end
 * @property string|null $location
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property float|null $distance
 * @property int|null $duration
 * @property \Illuminate\Support\Carbon|null $started_at
 * @property \Illuminate\Support\Carbon|null $stopped_at
 * @property string|null $training_type
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $rideable_type
 * @property int|null $rideable_id
 * @property string|null $waypoints
 * @property numeric|null $average_speed
 * @property numeric|null $max_speed
 * @property string|null $image_url
 * @property int $version
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereAverageSpeed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereCompletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereDistance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereDtEnd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereDtStart($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereDuration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereImageUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereMaxSpeed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereRecurrenceFrequency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereRecurrenceInterval($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereRideableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereRideableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereStartedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereStoppedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereTrainingType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereVersion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther whereWaypoints($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityOther withFamily()
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperActivityOther {}
}

namespace App\Models\Activity{
/**
 * @property int $id
 * @property int $user_id
 * @property int|null $type_id
 * @property string $title
 * @property string|null $description
 * @property string $recurrence_frequency
 * @property int|null $recurrence_interval
 * @property \Illuminate\Support\Carbon $dt_start
 * @property \Illuminate\Support\Carbon|null $dt_end
 * @property string|null $location
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property numeric|null $distance
 * @property int|null $duration
 * @property \Illuminate\Support\Carbon|null $started_at
 * @property \Illuminate\Support\Carbon|null $stopped_at
 * @property string|null $training_type
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $rideable_type
 * @property int|null $rideable_id
 * @property array<array-key, mixed>|null $waypoints
 * @property numeric|null $average_speed
 * @property numeric|null $max_speed
 * @property string|null $image_url
 * @property int $version
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereAverageSpeed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereCompletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereDistance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereDtEnd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereDtStart($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereDuration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereImageUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereMaxSpeed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereRecurrenceFrequency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereRecurrenceInterval($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereRideableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereRideableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereStartedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereStoppedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereTrainingType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereVersion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide whereWaypoints($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityRide withFamily()
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperActivityRide {}
}

namespace App\Models\Activity{
/**
 * @property int $id
 * @property int $user_id
 * @property int|null $type_id
 * @property string $title
 * @property string|null $description
 * @property string $recurrence_frequency
 * @property int|null $recurrence_interval
 * @property \Illuminate\Support\Carbon $dt_start
 * @property \Illuminate\Support\Carbon|null $dt_end
 * @property string|null $location
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property float|null $distance
 * @property int|null $duration
 * @property \Illuminate\Support\Carbon|null $started_at
 * @property \Illuminate\Support\Carbon|null $stopped_at
 * @property string|null $training_type
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $rideable_type
 * @property int|null $rideable_id
 * @property string|null $waypoints
 * @property numeric|null $average_speed
 * @property numeric|null $max_speed
 * @property string|null $image_url
 * @property int $version
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereAverageSpeed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereCompletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereDistance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereDtEnd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereDtStart($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereDuration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereImageUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereMaxSpeed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereRecurrenceFrequency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereRecurrenceInterval($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereRideableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereRideableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereStartedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereStoppedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereTrainingType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereVersion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining whereWaypoints($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ActivityTraining withFamily()
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperActivityTraining {}
}

namespace App\Models\Activity\Type{
/**
 * @property int $id
 * @property string $label
 * @property \App\Enums\TypeActivityFamily $family
 * @property string|null $color
 * @property int|null $user_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property bool $is_default
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TypeActivity newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TypeActivity newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TypeActivity query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TypeActivity whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TypeActivity whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TypeActivity whereFamily($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TypeActivity whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TypeActivity whereIsDefault($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TypeActivity whereLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TypeActivity whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TypeActivity whereUserId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperTypeActivity {}
}

namespace App\Models\Bikes{
/**
 * @property int $id
 * @property string $name
 * @property int $type_bike_id
 * @property int $user_id
 * @property bool $preferred
 * @property int $status
 * @property string|null $image_url
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Activity\Activity> $activities
 * @property-read int|null $activities_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Bikes\Components\Components> $components
 * @property-read int|null $components_count
 * @property-read \App\Models\Bikes\StatBike|null $stats
 * @property-read \App\Models\Bikes\TypeBike $type
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bike newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bike newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bike query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bike whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bike whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bike whereImageUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bike whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bike wherePreferred($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bike whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bike whereTypeBikeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bike whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bike whereUserId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperBike {}
}

namespace App\Models\Bikes{
/**
 * @property int $id
 * @property int $bike_id
 * @property int $component_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Bikes\Bike $bike
 * @property-read \App\Models\Bikes\Components\Components $component
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsBike newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsBike newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsBike query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsBike whereBikeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsBike whereComponentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsBike whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsBike whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsBike whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperComponentsBike {}
}

namespace App\Models\Bikes\Components{
/**
 * @property int $id
 * @property int|null $type_id
 * @property int|null $brand_id
 * @property string $model
 * @property string $status
 * @property bool $multi_bike
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $user_id
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Activity\Activity> $activities
 * @property-read int|null $activities_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Bikes\Bike> $bikes
 * @property-read int|null $bikes_count
 * @property-read \App\Models\Bikes\Components\ComponentsBrand|null $brand
 * @property-read \App\Models\Bikes\Components\ComponentsType|null $type
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Components newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Components newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Components query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Components whereBrandId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Components whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Components whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Components whereModel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Components whereMultiBike($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Components whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Components whereTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Components whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Components whereUserId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperComponents {}
}

namespace App\Models\Bikes\Components{
/**
 * @property int $id
 * @property string $label
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsBrand newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsBrand newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsBrand query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsBrand whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsBrand whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsBrand whereLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsBrand whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperComponentsBrand {}
}

namespace App\Models\Bikes\Components{
/**
 * @property int $id
 * @property string $label
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsType query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsType whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsType whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsType whereLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ComponentsType whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperComponentsType {}
}

namespace App\Models\Bikes{
/**
 * @property int $id
 * @property string $method
 * @property float|null $interval_distance
 * @property int|null $interval_time
 * @property int|null $interval_rides
 * @property string|null $manual_note
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $stat_bike_id
 * @property-read \App\Models\Bikes\StatBike $statBike
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ServiceBike newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ServiceBike newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ServiceBike query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ServiceBike whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ServiceBike whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ServiceBike whereIntervalDistance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ServiceBike whereIntervalRides($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ServiceBike whereIntervalTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ServiceBike whereManualNote($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ServiceBike whereMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ServiceBike whereStatBikeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ServiceBike whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperServiceBike {}
}

namespace App\Models\Bikes{
/**
 * @property int $id
 * @property int $bike_id
 * @property float $distance
 * @property int $rides
 * @property \Illuminate\Support\Carbon|null $last_service_date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Bikes\Bike $bike
 * @property-read \App\Models\Bikes\ServiceBike|null $service
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatBike newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatBike newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatBike query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatBike whereBikeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatBike whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatBike whereDistance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatBike whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatBike whereLastServiceDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatBike whereRides($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StatBike whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperStatBike {}
}

namespace App\Models\Bikes{
/**
 * @property int $id
 * @property string $label
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TypeBike newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TypeBike newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TypeBike query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TypeBike whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TypeBike whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TypeBike whereLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TypeBike whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperTypeBike {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string|null $description
 * @property string $challenge_type
 * @property int $challenge_value
 * @property int $duration_challenge
 * @property bool $is_daily_goal
 * @property bool $is_suggestion
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Challenge newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Challenge newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Challenge query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Challenge whereChallengeType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Challenge whereChallengeValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Challenge whereCompletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Challenge whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Challenge whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Challenge whereDurationChallenge($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Challenge whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Challenge whereIsDailyGoal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Challenge whereIsSuggestion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Challenge whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Challenge whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Challenge whereUserId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperChallenge {}
}

namespace App\Models\Notification{
/**
 * @property int $id
 * @property int $user_id
 * @property int $in_app_enabled
 * @property int $email_enabled
 * @property int $push_enabled
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference whereEmailEnabled($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference whereInAppEnabled($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference wherePushEnabled($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationPreference whereUserId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperNotificationPreference {}
}

namespace App\Models\Notification{
/**
 * @property int $id
 * @property int $user_id
 * @property string $token
 * @property string $platform
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PushToken newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PushToken newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PushToken query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PushToken whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PushToken whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PushToken wherePlatform($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PushToken whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PushToken whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PushToken whereUserId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperPushToken {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $firebase_uid
 * @property string $email
 * @property string|null $username
 * @property \Illuminate\Support\Carbon|null $birthday
 * @property \Illuminate\Support\Carbon|null $first_connected
 * @property bool|null $offline_mode
 * @property string|null $bio
 * @property string|null $website
 * @property string|null $picture
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $phone_number
 * @property string $language
 * @property string|null $first_name
 * @property string|null $last_name
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Activity\Activity> $activities
 * @property-read int|null $activities_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ActivitySnapshot> $activitySnapshots
 * @property-read int|null $activity_snapshots_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Bikes\Bike> $bikes
 * @property-read int|null $bikes_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Challenge> $challenges
 * @property-read int|null $challenges_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Bikes\Components\Components> $components
 * @property-read int|null $components_count
 * @property-read \App\Models\Notification\NotificationPreference|null $notificationPreferences
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Notification\PushToken> $pushTokens
 * @property-read int|null $push_tokens_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Activity\Activity> $rides
 * @property-read int|null $rides_count
 * @property-read mixed $stats
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Activity\Type\TypeActivity> $typeActivities
 * @property-read int|null $type_activities_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereBio($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereBirthday($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereFirebaseUid($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereFirstConnected($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereFirstName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereLanguage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereLastName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereOfflineMode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePhoneNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePicture($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUsername($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereWebsite($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperUser {}
}

