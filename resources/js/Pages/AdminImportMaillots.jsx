import { useState } from "react"
import { Head, router } from "@inertiajs/react"
import AdminLayout from "@/Layouts/AdminLayout"

// ─── Correspondance raccourci → nom affiché ──────────────────────────────────
const CLUB_NAMES = {
    // Ligue 1
    'lyon': 'Olympique Lyonnais', 'bordeaux': 'Girondins de Bordeaux',
    'angers': 'Angers SCO', 'annecy': 'Annecy FC', 'cannes': 'AS Cannes',
    'lille': 'Lille', 'monaco': 'Monaco', 'nice': 'Nice', 'rennes': 'Rennes',
    'strasbourg': 'Strasbourg', 'toulouse': 'Toulouse', 'nantes': 'Nantes',
    'montpellier': 'Montpellier', 'lens': 'Lens', 'reims': 'Reims', 'auxerre': 'AJ Auxerre',
    // Premier League
    'liverpool': 'Liverpool', 'manchester': 'Manchester City', 'arsenal': 'Arsenal',
    'chelsea': 'Chelsea', 'tottenham': 'Tottenham Hotspur', 'leicester': 'Leicester City',
    'villa': 'Aston Villa', 'newcastle': 'Newcastle United', 'everton': 'Everton',
    'wolverhampton': 'Wolverhampton Wanderers', 'brighton': 'Brighton',
    'palace': 'Crystal Palace', 'brentford': 'Brentford', 'fulham': 'Fulham',
    // Bundesliga
    'bayern': 'Bayern Munich', 'dortmund': 'Borussia Dortmund',
    'monchengladbach': 'Borussia Mönchengladbach', 'leipzig': 'RB Leipzig',
    'leverkusen': 'Bayer Leverkusen', 'wolfsburg': 'VfL Wolfsburg',
    'francfort': 'Eintracht Francfort', 'hoffenheim': 'Hoffenheim',
    'berlin': 'Hertha Berlin', 'stuttgart': 'VfB Stuttgart',
    'cologne': 'FC Cologne', 'schalke': 'Schalke 04',
    // La Liga
    'atletico': 'Atletico Madrid', 'bilbao': 'Athletic Bilbao', 'real': 'Real Madrid',
    'barcelone': 'FC Barcelone', 'sociedad': 'Real Sociedad', 'valence': 'Valence CF',
    'villarreal': 'Villarreal', 'sevilla': 'Sevilla FC', 'betis': 'Real Betis',
    'espanyol': 'Espanyol',
    // Serie A
    'inter': 'Inter Milan', 'ac-milan': 'AC Milan', 'naples': 'Naples',
    'juventus': 'Juventus', 'roma': 'AS Roma', 'lazio': 'Lazio Rome',
    'atalanta': 'Atalanta', 'fiorentina': 'Fiorentina', 'torino': 'Torino',
    'bologne': 'Bologne', 'come': 'Côme',
    // Autres clubs
    'porto': 'Porto', 'benfica': 'Benfica', 'sporting': 'Sporting CP',
    'galatasaray': 'Galatasaray', 'fenerbahce': 'Fenerbahçe',
    'celtic': 'Celtic FC', 'rangers': 'Rangers FC', 'ajax': 'Ajax Amsterdam',
    'psv': 'PSV Eindhoven', 'gremio': 'Grêmio', 'flamengo': 'Flamengo',
    'anderlecht': 'Anderlecht',
    // Sélections nationales
    'france': 'France', 'bresil': 'Brésil', 'espagne': 'Espagne',
    'pays-bas': 'Pays-Bas', 'belgique': 'Belgique', 'senegal': 'Sénégal',
    'cote-divoire': "Côte d'Ivoire", 'maroc': 'Maroc', 'suisse': 'Suisse',
    'pologne': 'Pologne', 'croatie': 'Croatie', 'suede': 'Suède',
    'danemark': 'Danemark', 'ukraine': 'Ukraine', 'japon': 'Japon',
    'coree-du-sud': 'Corée du Sud', 'mexique': 'Mexique', 'inde': 'Inde',
    'colombie': 'Colombie', 'uruguay': 'Uruguay', 'tunisie': 'Tunisie',
    'perou': 'Pérou', 'irlande': 'Irlande',
}

const TYPE_CONFIG = {
    'dom':   { label: 'Domicile' },
    'ext':   { label: 'Extérieur' },
    'third': { label: 'Third' },
}

// ─── Parsing côté client (miroir du PHP) ─────────────────────────────────────
function parseFilename(filename) {
    const nameWithoutExt = filename.replace(/\.[^.]+$/, '')
    const isBack = nameWithoutExt.endsWith('-back')
    const baseName = isBack ? nameWithoutExt.slice(0, -5) : nameWithoutExt

    const match = baseName.match(/^(.+)-(dom|ext|third)-(\d{2}-\d{2}|\d{2})$/)
    if (!match) return null

    return { clubShort: match[1], type: match[2], season: match[3], isBack, baseName }
}

function seasonToLabel(season) {
    if (season.includes('-')) {
        const [y1, y2] = season.split('-')
        return `20${y1}-20${y2}`
    }
    return `20${season}`
}

// ─── Composant principal ─────────────────────────────────────────────────────
export default function AdminImportMaillots({ auth }) {
    const [selectedFiles, setSelectedFiles] = useState([])
    const [preview, setPreview]             = useState([])
    const [overwrite, setOverwrite]         = useState(false)
    const [importing, setImporting]         = useState(false)

    const handleFileChange = (e) => {
        const fileList = Array.from(e.target.files)
        setSelectedFiles(fileList)

        // Repérer les images dos
        const backSet = new Set()
        fileList.forEach(f => {
            const base = f.name.replace(/\.[^.]+$/, '')
            if (base.endsWith('-back')) backSet.add(base.slice(0, -5))
        })

        // Construire le preview (faces uniquement)
        const items = []
        fileList.forEach(f => {
            const base = f.name.replace(/\.[^.]+$/, '')
            if (base.endsWith('-back')) return

            const parsed   = parseFilename(f.name)
            const hasBack  = backSet.has(base)

            if (!parsed) {
                items.push({ filename: f.name, status: 'error', message: 'Format invalide' })
                return
            }

            const clubName   = CLUB_NAMES[parsed.clubShort] ?? null
            const typeLabel  = TYPE_CONFIG[parsed.type]?.label ?? parsed.type
            const season     = seasonToLabel(parsed.season)
            const nom        = `${typeLabel} ${season}`

            items.push({
                filename:   f.name,
                clubShort:  parsed.clubShort,
                clubName,
                type:       typeLabel,
                season,
                nom,
                hasBack,
                status:     clubName ? 'ready' : 'error',
                message:    clubName ? null : `Club "${parsed.clubShort}" non trouvé`,
            })
        })

        setPreview(items)
    }

    const validCount = preview.filter(p => p.status === 'ready').length
    const errorCount = preview.filter(p => p.status === 'error').length

    const handleImport = () => {
        const data = new FormData()
        selectedFiles.forEach(f => data.append('files[]', f))
        data.append('overwrite_duplicates', overwrite ? 1 : 0)

        setImporting(true)
        router.post('/admin/import-maillots', data, {
            onFinish: () => setImporting(false),
            onSuccess: () => {
                setSelectedFiles([])
                setPreview([])
                // Réinitialiser l'input file
                const input = document.getElementById('file-input')
                if (input) input.value = ''
            },
        })
    }

    return (
        <AdminLayout>
            <Head title="Import Maillots" />

            <div className="space-y-6">
                {/* En-tête */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Import Maillots</h1>
                    <p className="text-gray-600 mt-1">Importez plusieurs maillots en une seule opération</p>
                </div>

                {/* Convention de nommage */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                    <p className="font-semibold text-blue-900 mb-2">Convention de nommage</p>
                    <div className="space-y-1 text-blue-800">
                        <p>
                            Clubs :{' '}
                            <code className="bg-blue-100 px-1 rounded">lyon-dom-26-27.webp</code>{' '}
                            <code className="bg-blue-100 px-1 rounded">ac-milan-ext-26-27-back.webp</code>
                        </p>
                        <p>
                            Sélections :{' '}
                            <code className="bg-blue-100 px-1 rounded">france-dom-26.webp</code>{' '}
                            <code className="bg-blue-100 px-1 rounded">bresil-ext-26-back.webp</code>
                        </p>
                        <p className="text-blue-700">
                            Types : <strong>dom</strong> · <strong>ext</strong> · <strong>third</strong> —
                            Image dos : suffixe <strong>-back</strong> — Max 20 fichiers par import
                        </p>
                    </div>
                </div>

                {/* Zone d'upload */}
                <div className="bg-white rounded-lg shadow p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sélectionner les images
                    </label>
                    <input
                        id="file-input"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                            file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100 cursor-pointer"
                    />

                    {preview.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center gap-4">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={overwrite}
                                    onChange={e => setOverwrite(e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                Écraser les doublons existants
                            </label>
                            <span className="text-sm text-gray-500">
                                {validCount > 0 && <span className="text-green-600 font-medium">{validCount} valide(s)</span>}
                                {validCount > 0 && errorCount > 0 && ' · '}
                                {errorCount > 0 && <span className="text-red-600 font-medium">{errorCount} erreur(s)</span>}
                            </span>
                        </div>
                    )}
                </div>

                {/* Tableau de preview */}
                {preview.length > 0 && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fichier</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom généré</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Dos</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {preview.map((item, i) => (
                                        <tr
                                            key={i}
                                            className={
                                                item.status === 'error'
                                                    ? 'bg-red-50'
                                                    : 'hover:bg-gray-50'
                                            }
                                        >
                                            <td className="px-4 py-3 text-xs font-mono text-gray-600 max-w-xs truncate">
                                                {item.filename}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {item.clubName
                                                    ? <span className="text-gray-900">{item.clubName}</span>
                                                    : <span className="text-red-500 text-xs italic">{item.clubShort}</span>
                                                }
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                {item.nom ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-center text-sm">
                                                {item.hasBack ? '✅' : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {item.status === 'ready'
                                                    ? <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Prêt</span>
                                                    : <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">{item.message}</span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Bouton import */}
                        {validCount > 0 && (
                            <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    Stock par défaut : 25 par taille · Prix : 20,00 € · Marqué "Nouveau"
                                </p>
                                <button
                                    onClick={handleImport}
                                    disabled={importing}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700
                                        disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors
                                        flex items-center gap-2"
                                >
                                    {importing && (
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    )}
                                    {importing ? 'Import en cours…' : `Importer ${validCount} maillot(s)`}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}