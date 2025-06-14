<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AddressController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('AddressesPage', [
            'billingAddresses' => $user->addresses()->where('type', 'billing')->get(),
            'shippingAddresses' => $user->addresses()->where('type', 'shipping')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|in:billing,shipping',
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:2',
            'phone' => 'nullable|string|max:20',
            'is_default' => 'boolean',
        ]);

        if ($data['is_default'] ?? false) {
            Address::where('user_id', Auth::id())
                ->where('type', $data['type'])
                ->update(['is_default' => false]);
        }

        Address::create([
            ...$data,
            'user_id' => Auth::id(),
        ]);

        return redirect()->back();
    }

    public function update(Request $request, Address $address)
    {
        $this->authorize('update', $address);

        $data = $request->validate([
            'type' => 'required|in:billing,shipping',
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:2',
            'phone' => 'nullable|string|max:20',
            'is_default' => 'boolean',
        ]);

        if ($data['is_default'] ?? false) {
            Address::where('user_id', Auth::id())
                ->where('type', $data['type'])
                ->update(['is_default' => false]);
        }

        $address->update($data);

        return redirect()->back();
    }

    public function destroy(Address $address)
    {
        $this->authorize('delete', $address);
        $address->delete();

        return redirect()->back();
    }
}
