import { describe, it, expect } from 'vitest';

function parseCSV(text){
  const rows=[]; let i=0, f='', q=false, r=[];
  for(; i<text.length; i++){
    const c=text[i], n=text[i+1];
    if(q){
      if(c==='"' && n==='"'){ f+='"'; i++; }
      else if(c==='"'){ q=false; }
      else f+=c;
    }else{
      if(c===','){ r.push(f); f=''; }
      else if(c==='"'){ q=true; }
      else if(c==='\n'){ r.push(f); rows.push(r); r=[]; f=''; }
      else if(c==='\r'){ /* ignore */ }
      else f+=c;
    }
  }
  if(f.length || r.length){ r.push(f); rows.push(r); }
  if(!rows.length) return [];
  const head=rows[0].map(h=>h.trim());
  return rows.slice(1).filter(a=>a.length && a.some(x=>x && x.trim()!==''))
    .map(a=>{ const o={}; head.forEach((k,idx)=>o[k]=a[idx]!==undefined?a[idx].trim():'' ); return o; });
}

describe('parseCSV', () => {
  it('parses CSV rows', () => {
    const csv = `id,name,category,difficulty,hero,hiso,weight,exclude,image,desc,version\n`+
                `pos-001,Classic Missionary,Missionary,2,3,4,1,0,assets/positions/f013-01.jpg,"Gentle, intimate eye contact.",1`;
    const rows = parseCSV(csv);
    expect(rows.length).toBe(1);
    expect(rows[0].id).toBe('pos-001');
    expect(rows[0].image).toBe('assets/positions/f013-01.jpg');
  });
});
