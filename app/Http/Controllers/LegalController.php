<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use App\Models\UserAddress;
use App\Helpers\CountryHelper;

class LegalController extends Controller
{
    /**
     * Afficher la page des mentions légales avec les infos de l'admin
     */
    public function index()
    {
        // Récupérer l'admin (premier utilisateur avec role 'admin')
        $admin = User::where('role', 'admin')->first();
        
        $legalInfo = [
            'email' => $admin ? $admin->email : 'contact@fou2foot.com',
            'phone' => $admin ? $admin->phone : null,
        ];
        
        // Récupérer l'adresse de l'admin si elle existe
        if ($admin) {
            $address = UserAddress::where('user_id', $admin->id)
                ->where('is_default', true)
                ->first();
            
            if ($address) {
                $legalInfo['address'] = [
                    'street' => $address->street,
                    'postal_code' => $address->postal_code,
                    'city' => $address->city,
                    'country' => CountryHelper::name($address->country),
                ];
            }
        }
        
        return Inertia::render('Legal', [
            'legalInfo' => $legalInfo,
        ]);
    }
}