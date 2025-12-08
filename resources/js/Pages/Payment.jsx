import { useState } from "react"
import { Head, router } from "@inertiajs/react"
import Header from "@/Components/Header"
import Footer from "@/Components/Footer"

// Icônes SVG
const CardIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
)

const PayPalIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506L9.95 7.3a.641.641 0 0 1 .633-.74h2.19c2.352 0 4.524-.236 6.123-2.196a5.446 5.446 0 0 1 2.326-1.447z" />
  </svg>
)

const BankIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
)

const LockIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
)

export default function Payment({ auth, items = [], subtotal, supplements, shipping_cost, total, shippingAddress, billingAddress }) {
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [processing, setProcessing] = useState(false)

  const handlePayment = (e) => {
    e.preventDefault()

    if (!paymentMethod) {
      alert("Veuillez sélectionner un mode de paiement")
      return
    }

    setProcessing(true)

    router.post('/payment/process', {
      payment_method: paymentMethod
    }, {
      onFinish: () => setProcessing(false),
      onError: (errors) => {
        console.error('Erreur paiement:', errors)
        setProcessing(false)
      }
    })
  }

  const paymentMethods = [
    {
      id: 'card',
      name: 'Carte bancaire',
      icon: CardIcon,
      description: 'Visa, Mastercard, American Express',
      badge: 'Rapide et sécurisé'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: PayPalIcon,
      description: 'Paiement avec votre compte PayPal',
      badge: 'Protection acheteur'
    },
    {
      id: 'transfer',
      name: 'Virement bancaire',
      icon: BankIcon,
      description: 'Paiement par virement',
      badge: 'Sous 2-3 jours'
    }
  ]

  return (
    <>
      <Head title="Paiement" />
      <Header />

      <main className="min-h-screen bg-gradient-to-r from-purple-200 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb / Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">Panier</span>
              </div>
              <div className="w-12 h-0.5 bg-green-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">Livraison</span>
              </div>
              <div className="w-12 h-0.5 bg-blue-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-blue-600">Paiement</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Section principale : Paiement */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <LockIcon className="w-6 h-6 text-green-600" />
                  <h1 className="text-2xl font-bold text-gray-900">Paiement sécurisé</h1>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                  <strong>Mode test :</strong> Choisissez un mode de paiement. Aucun paiement réel ne sera effectué.
                </p>

                {/* Sélection du mode de paiement */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Sélectionnez votre mode de paiement</h2>

                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Icône */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          paymentMethod === method.id ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <method.icon className={`w-6 h-6 ${
                            paymentMethod === method.id ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>

                        {/* Infos */}
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{method.name}</span>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                              {method.badge}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                        </div>

                        {/* Radio */}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === method.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {paymentMethod === method.id && (
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Bouton de paiement */}
                <button
                  onClick={handlePayment}
                  disabled={!paymentMethod || processing}
                  className="w-full mt-8 py-4 bg-gradient-to-r from-red-800 to-blue-500 text-white rounded-lg font-bold text-lg hover:from-red-900 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Traitement en cours...
                    </span>
                  ) : (
                    `Payer ${total?.toFixed(2)}€`
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  En validant, vous acceptez nos conditions générales de vente
                </p>
              </div>
            </div>

            {/* Sidebar : Récapitulatif */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Récapitulatif</h2>

                {/* Articles */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img 
                        src={`/${item.image}`} 
                        alt={item.title} 
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          Taille: {item.size} • Qté: {item.quantity}
                        </p>
                        {item.personalization_text && (
                          <p className="text-xs text-blue-600">{item.personalization_text}</p>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.total?.toFixed(2)}€
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totaux */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-medium">{subtotal?.toFixed(2)}€</span>
                  </div>
                  {supplements > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Personnalisation</span>
                      <span className="font-medium">{supplements?.toFixed(2)}€</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Livraison</span>
                    <span className="font-medium text-green-600">
                      {shipping_cost === 0 ? 'Gratuite' : `${shipping_cost?.toFixed(2)}€`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-blue-600">{total?.toFixed(2)}€</span>
                  </div>
                </div>

                {/* Adresse de livraison */}
                {shippingAddress && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Livraison à :</h3>
                    <p className="text-sm text-gray-600">
                      {shippingAddress.first_name} {shippingAddress.last_name}<br />
                      {shippingAddress.street}<br />
                      {shippingAddress.postal_code} {shippingAddress.city}<br />
                      {shippingAddress.country}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}