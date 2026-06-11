<?php

return [

    'success' => 'Merci pour votre message, :name ! Vous recevrez bientôt de nos nouvelles.',

    'validation' => [

        'name_required' => 'Le nom est requis.',
        'name_string' => 'Le nom doit être une chaîne de caractères.',
        'name_max' => 'Le nom ne peut pas dépasser 255 caractères.',
        'name_min' => 'Le nom doit comporter au moins 2 caractères.',

        'email_required' => "L'email est requis.",
        'email_email' => "L'email doit être valide.",
        'email_max' => "L'email ne peut pas dépasser 255 caractères.",

        'subject_required' => 'Le sujet est requis.',
        'subject_string' => 'Le sujet doit être une chaîne de caractères.',
        'subject_max' => 'Le sujet ne peut pas dépasser 255 caractères.',
        'subject_in' => 'Le sujet doit être : bug, suggestion, question ou autre.',

        'message_required' => 'Le message est requis.',
        'message_string' => 'Le message doit être une chaîne de caractères.',
        'message_max' => 'Le message ne peut pas dépasser 1000 caractères.',

    ],

];
