<?php

   return [
       'required'  => 'Le champ :attribute est obligatoire.',
       'email'     => 'Le champ :attribute doit être une adresse email valide.',
       'unique'    => 'Ce :attribute est déjà utilisé.',
       'confirmed' => 'La confirmation du :attribute ne correspond pas.',
       'min' => [
           'string' => 'Le :attribute doit contenir au moins :min caractères.',
       ],
       'password' => [
           'mixed'         => 'Le mot de passe doit contenir au moins une majuscule et une minuscule.',
           'numbers'       => 'Le mot de passe doit contenir au moins un chiffre.',
           'symbols'       => 'Le mot de passe doit contenir au moins un caractère spécial.',
           'letters'       => 'Le mot de passe doit contenir au moins une lettre.',
           'uncompromised' => 'Ce mot de passe est apparu dans une fuite de données. Choisissez-en un autre.',
       ],

       'attributes' => [
           'password'         => 'mot de passe',
           'current_password' => 'mot de passe actuel',
           'email'            => 'email',
           'username'         => "nom d'utilisateur",
       ],
   ];
