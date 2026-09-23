import React, { useState } from 'react';
import { 
  Search, GlassWater, Flame, Bookmark, Wine, Globe, 
  PlusCircle, X, Droplets, Sparkles, SlidersHorizontal, 
  ChevronRight, ArrowLeft, RefreshCw
} from 'lucide-react';

const INITIAL_DRINKS = [
  {
    id: 'esp-martini',
    name: 'Espresso Martini',
    arabicName: 'إسبريسو مارتيني',
    category: 'Cócteles Clásicos',
    vibe: 'Noche / Elegante',
    abv: 19.5,
    glass: 'Copa Coupette',
    technique: 'Agitado (Shake)',
    description: 'Mezcla sofisticada de espresso recién preparado con la intensidad del vodka y el toque cremoso del licor de café.',
    ingredients: [
      { name: 'Vodka', oz: '1.5 oz', ml: '45 ml', type: 'alcohol' },
      { name: 'Licor de Café (Kahlúa)', oz: '0.75 oz', ml: '22.5 ml', type: 'alcohol' },
      { name: 'Jarabe Simple (1:1)', oz: '0.25 oz', ml: '7.5 ml', type: 'syrup' },
      { name: 'Café Espresso Fresco', oz: '1.0 oz', ml: '30 ml', type: 'mixer' }
    ],
    garnish: '3 granos de café flotando',
    history: 'Creado en Londres en los años 80 por Dick Bradsell.'
  },
  {
    id: 'mojito',
    name: 'Mojito Cubano',
    arabicName: 'موخيتو كلاسيك',
    category: 'Refrescantes',
    vibe: 'Verano / Fiesta',
    abv: 13.0,
    glass: 'Vaso Highball',
    technique: 'Macerado (Muddle)',
    description: 'Símbolo del Caribe. Menta fresca, jugo de lima y azúcar equilibrados con ron blanco efervescente.',
    ingredients: [
      { name: 'Ron Blanco', oz: '2.0 oz', ml: '60 ml', type: 'alcohol' },
      { name: 'Jarabe Simple o Azúcar', oz: '0.75 oz', ml: '22.5 ml', type: 'syrup' },
      { name: 'Jugo de Lima', oz: '1.0 oz', ml: '30 ml', type: 'mixer' },
      { name: 'Hojas de Hierbabuena', oz: '8-10 hojas', ml: '8-10 hojas', type: 'mixer' },
      { name: 'Club Soda', oz: 'Completar', ml: 'Completar', type: 'mixer' }
    ],
    garnish: 'Ramita de menta fresca y rodaja de lima',
    history: 'Originario de La Habana, Cuba.'
  },
  {
    id: 'margarita',
    name: 'Margarita Tradicional',
    arabicName: 'مارغريتا',
    category: 'Cócteles Clásicos',
    vibe: 'Fiesta / Cítrico',
    abv: 26.0,
    glass: 'Copa Margarita / Rocks',
    technique: 'Agitado (Shake)',
    description: 'Equilibrio perfecto entre la potencia del tequila blanco, el dulzor del licor de naranja y la acidez de la lima.',
    ingredients: [
      { name: 'Tequila Blanco', oz: '2.0 oz', ml: '60 ml', type: 'alcohol' },
      { name: 'Triple Sec / Cointreau', oz: '1.0 oz', ml: '30 ml', type: 'alcohol' },
      { name: 'Jarabe de Agave', oz: '0.25 oz', ml: '7.5 ml', type: 'syrup' },
      { name: 'Jugo de Lima Fresco', oz: '1.0 oz', ml: '30 ml', type: 'mixer' }
    ],
    garnish: 'Borde escarchado con sal de mar',
    history: 'Icono de la coctelería mexicana creado en la década de 1930.'
  }
];

export default function App() {
  const [drinks, setDrinks] = useState(INITIAL_DRINKS);
  const [search, setSearch] = useState('');
  const [unit, setUnit] = useState('oz'); // 'oz' o 'ml'
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [activeTab, setActiveTab] = useState('explorar');
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [savedDrinks, setSavedDrinks] = useState(['esp-martini']);

  const categories = ['Todas', 'Refrescantes', 'Cócteles Clásicos', 'Noche / Elegante'];

  const filtered = drinks.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.ingredients.some(i => i.name.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCategory === 'Todas' || d.category === selectedCategory || d.vibe === selectedCategory;
    if (activeTab === 'guardados') return matchesSearch && savedDrinks.includes(d.id);
    return matchesSearch && matchesCat;
  });

  const toggleSave = (id) => {
    setSavedDrinks(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="flex justify-center bg-zinc-950 text-zinc-100 min-h-screen font-sans">
      <div className="w-full max-w-md bg-zinc-900 border-x border-zinc-800 min-h-screen flex flex-col shadow-2xl relative pb-20">
        
        {/* Header Estilo Meshrubat */}
        <header className="sticky top-0 z-30 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 px-4 pt-4 pb-3 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-extrabold text-xl tracking-tight text-amber-400 font-serif">
                MESHRUBAT <span className="text-xs text-zinc-400 font-sans font-normal">| مشروبات</span>
              </h1>
              <p className="text-[10px] text-zinc-400">Guía & Catálogo de Bebidas</p>
            </div>

            {/* Switch Unidades Oz / Ml */}
            <button 
              onClick={() => setUnit(unit === 'oz' ? 'ml' : 'oz')}
              className="flex items-center gap-1 bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-full text-xs text-amber-400 font-mono font-bold"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{unit.toUpperCase()}</span>
            </button>
          </div>

          {/* Buscador */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text"
              placeholder="Buscar por licor, ingrediente o cóctel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-8 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Categorías / Vibes */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition border ${
                  selectedCategory === cat 
                    ? 'bg-amber-500 text-zinc-950 font-bold border-amber-400' 
                    : 'bg-zinc-950/60 text-zinc-400 border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Lista de Bebidas */}
        <main className="p-4 space-y-3 flex-1">
          {filtered.map((drink) => (
            <div 
              key={drink.id}
              onClick={() => setSelectedDrink(drink)}
              className="p-3.5 bg-gradient-to-b from-zinc-800/50 to-zinc-950/80 border border-zinc-800 hover:border-amber-500/40 rounded-2xl cursor-pointer transition relative"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-amber-400/90 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {drink.vibe}
                  </span>
                  <h3 className="font-bold text-base text-zinc-100 mt-1">{drink.name}</h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">{drink.description}</p>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); toggleSave(drink.id); }}
                  className={`p-2 rounded-xl border ${savedDrinks.includes(drink.id) ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Vista rápida ingredientes */}
              <div className="mt-3 pt-2 border-t border-zinc-800/60 flex flex-wrap gap-1">
                {drink.ingredients.map((ing, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-300">
                    {ing.name}: <strong className="text-amber-400">{unit === 'oz' ? ing.oz : ing.ml}</strong>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </main>

        {/* Modal Receta Completa */}
        {selectedDrink && (
          <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-end justify-center">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-xs text-amber-400 font-mono">{selectedDrink.technique}</span>
                  <h2 className="text-xl font-bold text-zinc-100">{selectedDrink.name}</h2>
                </div>
                <button onClick={() => setSelectedDrink(null)} className="p-2 bg-zinc-800 rounded-full text-zinc-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-zinc-300 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                {selectedDrink.description}
              </p>

              {/* Ingredientes desglosados */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Ingredientes ({unit.toUpperCase()})</h4>
                {selectedDrink.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                    <span className="text-zinc-200">{ing.name}</span>
                    <span className="font-mono text-amber-400 font-bold">{unit === 'oz' ? ing.oz : ing.ml}</span>
                  </div>
                ))}
              </div>

              <div className="text-xs space-y-1 pt-2 border-t border-zinc-800">
                <p><strong className="text-zinc-400">Cristalería:</strong> {selectedDrink.glass}</p>
                <p><strong className="text-zinc-400">Guarnición:</strong> {selectedDrink.garnish}</p>
                <p className="text-zinc-500 italic mt-2">{selectedDrink.history}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Inferior */}
        <nav className="fixed bottom-0 w-full max-w-md bg-zinc-900/95 border-t border-zinc-800 px-8 py-2 z-40 flex justify-around text-xs">
          <button onClick={() => setActiveTab('explorar')} className={`flex flex-col items-center gap-1 ${activeTab === 'explorar' ? 'text-amber-400 font-bold' : 'text-zinc-500'}`}>
            <GlassWater className="w-5 h-5" />
            <span className="text-[10px]">Buscador</span>
          </button>
          <button onClick={() => setActiveTab('guardados')} className={`flex flex-col items-center gap-1 ${activeTab === 'guardados' ? 'text-amber-400 font-bold' : 'text-zinc-500'}`}>
            <Bookmark className="w-5 h-5" />
            <span className="text-[10px]">Guardados</span>
          </button>
        </nav>

      </div>
    </div>
  );
}

