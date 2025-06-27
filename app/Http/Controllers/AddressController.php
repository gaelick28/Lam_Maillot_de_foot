<?php

namespace App\Http\Controllers;

use App\Models\UserAddress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class AddressController extends Controller
{
    use AuthorizesRequests;
    public function index()
    {
        $addresses = request()->user()->addresses()->get();

        return Inertia::render('Addresses', [
            'addresses' => $addresses,
        ]);

        
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'street' => 'required|string',
            'city' => 'required|string',
            'postal_code' => 'required|string',
            'country' => 'required|string|max:2',
            'phone' => 'nullable|string',
            'is_default' => 'boolean',
        ]);

        $address = $request->user()->addresses()->create($validated);

        return redirect()->back()->with('success', 'Adresse ajoutée.');
    }

    public function update(Request $request, UserAddress $address)
    {
        // $this->authorize('update', $address); 

        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'street' => 'required|string|max:255',
            'city'   => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
        ]);

        $address->update($validated);

        return redirect()->route('addresses.index')->with('success', 'Adresse mise à jour.');
    }

    public function destroy(UserAddress $address)
    {
        // $this->authorize('delete', $address); // facultatif mais conseillé

        $address->delete();

        return redirect()->route('addresses.index')->with('success', 'Adresse supprimée.');
    }
}
