import { execFileSync } from 'node:child_process';
import { mkdirSync,writeFileSync } from 'node:fs';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8',maxBuffer:50*1024*1024}).trim();
const findings=[];
const scanned=new Set();
for(const revision of git('rev-list','--all').split('\n').filter(Boolean)){
 for(const entry of git('ls-tree','-r',revision).split('\n')){
  const m=entry.match(/^\d+ blob ([a-f0-9]+)\t(.+)$/);if(!m)continue;const [,blob,path]=m;
  if(/(^|\/)\.env(\.|$)/.test(path)&&!path.endsWith('.example'))findings.push({revision:revision.slice(0,7),path,kind:'Archivo de entorno versionado'});
  if(scanned.has(blob))continue;scanned.add(blob);
  const content=git('cat-file','blob',blob);
  if(content.includes('\0'))continue;
  if(/postgres(?:ql)?:\/\/[^\s/]+:[^\s@]+@|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:ghp_|github_pat_)[A-Za-z0-9_]{25,}/.test(content))findings.push({revision:revision.slice(0,7),path,kind:'Patrón de credencial'});
 }
}
mkdirSync('tmp/evidence',{recursive:true});
writeFileSync('tmp/evidence/secret-scan.json',JSON.stringify({date:new Date().toISOString(),blobs:scanned.size,findings},null,2));
console.log(`Revisión de historial: ${scanned.size} blobs, ${findings.length} hallazgos. No se muestran valores.`);
if(findings.length)process.exitCode=1;
