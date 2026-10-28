/* ---------- Almacenamiento seguro ---------- */
export const store={
  get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
};
export async function hashPass(s){
  const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('itch2:'+s));
  return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
}

