<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', function () {
    return Inertia::render('Home');
});

Route::fallback(function () {
    return Inertia::render('Page404');
});
