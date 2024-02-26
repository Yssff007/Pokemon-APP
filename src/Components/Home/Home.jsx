import React, { useCallback, useMemo } from 'react';
import { useReducer, useEffect,createContext,useContext } from 'react';

function usePokemonSource() {
  const [{pokemon,search}, dispatch]=useReducer((state,action)=>{
    switch (action.type){
      case "setPokemon" :
        return {...state,pokemon:action.payload};
      case 'setSearch':
        return {...state,search:action.payload};
    }
  },{
    pokemon:[],
    search:'',
  });

  useEffect(()=>{
    fetch("/pokemon.json")
     .then((response)=>response.json())
     .then((data)=>
     dispatch({
      type: "setPokemon",
      payload: data,
     }))
  },[]);

  const setSearch = useCallback((search)=>{
    dispatch({
      type: 'setSearch',
      payload: search,
    })
  },[]);

  const filteredPokemon = useMemo(()=>
    pokemon.filter((p)=>p.name.toLowerCase().includes(search.toLowerCase()))
  ,[pokemon,search]);
  
  return {pokemon:filteredPokemon,search,setSearch};
}
const pokemonContext = createContext({pokemon:[]});

export function usePokemon(){
  return useContext(pokemonContext);
 };

export function PokemonProvider({ children }) {
  return (
    <pokemonContext.Provider value={usePokemonSource()}>
      {children}
    </pokemonContext.Provider>
  );
}
