import { useEffect, useState } from "react";

// Colores por tipo
const typeColors = {
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400",
  ice: "bg-blue-200",
  fighting: "bg-orange-600",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-300",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-gray-600",
  ghost: "bg-indigo-700",
  dragon: "bg-purple-700",
  dark: "bg-gray-800",
  steel: "bg-gray-400",
  fairy: "bg-pink-300",
  normal: "bg-gray-300",
};

// Colores de barra por stat
const getBarColor = (value) => {
  if (value >= 100) return "bg-green-500";
  if (value >= 70) return "bg-yellow-400";
  return "bg-red-500";
};

export default function ApokedexComponent() {
  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPokemons = async (isInitial = false) => {
    setLoading(true);
    const currentOffset = isInitial ? 0 : offset;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${currentOffset}`);
    const data = await response.json();

    const details = await Promise.all(
      data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        return await res.json();
      })
    );

    if (isInitial) {
      setPokemonList(details);
      setOffset(20);
    } else {
      setPokemonList((prevList) => [...prevList, ...details]);
      setOffset((prevOffset) => prevOffset + 20);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPokemons(true); // Solo carga los primeros 20 al iniciar
  }, []);

  const filteredPokemons = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Pokédex</h1>

      {/* Buscador */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Grid de 4 columnas */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {filteredPokemons.map((pokemon) => {
          const hp = pokemon.stats[0].base_stat;
          const attack = pokemon.stats[1].base_stat;
          const defense = pokemon.stats[2].base_stat;
          const specialAttack = pokemon.stats[3].base_stat;

          return (
            <div
              key={pokemon.id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-lg"
            >
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-24 h-24 mb-2"
              />
              <h2 className="text-lg font-semibold text-gray-700 capitalize mb-2">
                {pokemon.name}
              </h2>

              {/* Tipos */}
              <div className="flex gap-2 mb-3">
                {pokemon.types.map(({ type }) => (
                  <span
                    key={type.name}
                    className={`text-white text-xs font-semibold px-2 py-1 rounded-full ${typeColors[type.name] || "bg-gray-400"}`}
                  >
                    {type.name}
                  </span>
                ))}
              </div>

              {/* Barras de stats */}
              <div className="w-full">
                {[["HP", hp], ["ATK", attack], ["DEF", defense], ["SPA", specialAttack]].map(
                  ([label, value]) => (
                    <div key={label} className="mb-1">
                      <span className="text-xs font-medium text-gray-600">
                        {label}: {value}
                      </span>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-2 ${getBarColor(value)} rounded-full`}
                          style={{ width: `${Math.min(value, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mostrar más */}
      <div className="flex justify-center">
        <button
          onClick={() => fetchPokemons(false)}
          disabled={loading}
          className="bg-green-500 text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-green-600 transition disabled:opacity-50"
        >
          {loading ? "Cargando..." : "Mostrar más Pokémon"}
        </button>
      </div>
    </div>
  );
}
