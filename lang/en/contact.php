<?php

return [

    'success' => 'Thank you for your message, :name! We will get back to you soon.',

    'validation' => [

        'name_required' => 'The name is required.',
        'name_string' => 'The name must be a string.',
        'name_max' => 'The name may not be greater than 255 characters.',
        'name_min' => 'The name must be at least 2 characters.',

        'email_required' => 'The email is required.',
        'email_email' => 'The email must be a valid email address.',
        'email_max' => 'The email may not be greater than 255 characters.',

        'subject_required' => 'The subject is required.',
        'subject_string' => 'The subject must be a string.',
        'subject_max' => 'The subject may not be greater than 255 characters.',
        'subject_in' => 'The subject must be one of: bug, suggestion, question, or other.',

        'message_required' => 'The message is required.',
        'message_string' => 'The message must be a string.',
        'message_max' => 'The message may not be greater than 1000 characters.',

    ],

];
