(()=>{"use strict";var e={r:e=>{"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}};e.r({});const t=(e,...t)=>postMessage({type:e,payload:t}),n=function(){const e=function(...e){throw new Error(e.join(" "))};globalThis.window===globalThis?e("This code cannot run from the main thread.","Load it as a Worker from a separate Worker."):navigator?.storage?.getDirectory||e("This API requires navigator.storage.getDirectory.");const n=Object.create(null);n.verbose=1;const s={0:console.error.bind(console),1:console.warn.bind(console),2:console.log.bind(console)},a=(e,...t)=>{n.verbose>e&&s[e]("OPFS asyncer:",...t)},o=(...e)=>a(2,...e),i=(...e)=>a(1,...e),c=(...e)=>a(0,...e),r=Object.create(null);r.reset=()=>{let e;for(e in n.opIds)(t=r[e]=Object.create(null)).count=t.time=t.wait=0;var t;let s=r.s11n=Object.create(null);s=s.serialize=Object.create(null),s.count=s.time=0,s=r.s11n.deserialize=Object.create(null),s.count=s.time=0},r.dump=()=>{let e,t=0,s=0,a=0;for(e in n.opIds){const n=r[e];t+=n.count,s+=n.time,a+=n.wait,n.avgTime=n.count&&n.time?n.time/n.count:0}console.log(globalThis?.location?.href,"metrics for",globalThis?.location?.href,":\n",r,"\nTotal of",t,"op(s) for",s,"ms","approx",a,"ms spent waiting on OPFS APIs."),console.log("Serialization metrics:",r.s11n)};const l=Object.create(null),d=new Set,f=function(e,t){const n=new URL(e,"file://irrelevant").pathname;return t?n.split("/").filter((e=>!!e)):n},y=async function(e,t=!1){const s=f(e,!0),a=s.pop();let o=n.rootDir;for(const n of s)n&&(o=await o.getDirectoryHandle(n,{create:!!t}));return[o,a]},u=async e=>{if(e.syncHandle){o("Closing sync handle for",e.filenameAbs);const t=e.syncHandle;return delete e.syncHandle,delete e.xLock,d.delete(e.fid),t.close()}},p=async e=>{try{await u(e)}catch(t){i("closeSyncHandleNoThrow() ignoring:",t,e)}},b=async()=>{if(d.size)for(const e of d){const t=l[e];await p(t),o("Auto-unlocked",e,t.filenameAbs)}},m=async e=>{if(e.releaseImplicitLocks&&d.has(e.fid))return p(e)};class w extends Error{constructor(e,...t){super([...t,": "+e.name+":",e.message].join(" "),{cause:e}),this.name="GetSyncHandleError"}}w.convertRc=(e,t)=>e instanceof w&&("NoModificationAllowedError"===e.cause.name||"DOMException"===e.cause.name&&0===e.cause.message.indexOf("Access Handles cannot"))?n.sq3Codes.SQLITE_BUSY:t;const g=async(e,t)=>{if(!e.syncHandle){const a=performance.now();o("Acquiring sync handle for",e.filenameAbs);const c=6,r=2*n.asyncIdleWaitTime;let l=1,f=r;for(;;f=r*++l)try{e.syncHandle=await e.fileHandle.createSyncAccessHandle();break}catch(s){if(l===c)throw new w(s,"Error getting sync handle for",t+"().",c,"attempts failed.",e.filenameAbs);i("Error getting sync handle for",t+"(). Waiting",f,"ms and trying again.",e.filenameAbs,s),Atomics.wait(n.sabOPView,n.opIds.retry,0,f)}o("Got",t+"() sync handle for",e.filenameAbs,"in",performance.now()-a,"ms"),e.xLock||(d.add(e.fid),o("Acquired implicit lock for",t+"()",e.fid,e.filenameAbs))}return e.syncHandle},O=(e,t)=>{o(e+"() => notify(",t,")"),Atomics.store(n.sabOPView,n.opIds.rc,t),Atomics.notify(n.sabOPView,n.opIds.rc)},E=function(t,n){n.readOnly&&e(t+"(): File is read-only: "+n.filenameAbs)},h=Object.create(null);h.op=void 0,h.start=void 0;const x=e=>{h.start=performance.now(),h.op=e,++r[e].count},I=()=>r[h.op].time+=performance.now()-h.start,S=Object.create(null);S.op=void 0,S.start=void 0;const T=e=>{S.start=performance.now(),S.op=e},R=()=>r[S.op].wait+=performance.now()-S.start;let A=!1;const L={"opfs-async-metrics":async()=>{x("opfs-async-metrics"),r.dump(),O("opfs-async-metrics",0),I()},"opfs-async-shutdown":async()=>{A=!0,O("opfs-async-shutdown",0)},mkdir:async e=>{x("mkdir");let t=0;T("mkdir");try{await y(e+"/filepart",!0)}catch(s){n.s11n.storeException(2,s),t=n.sq3Codes.SQLITE_IOERR}finally{R()}O("mkdir",t),I()},xAccess:async e=>{x("xAccess");let t=0;T("xAccess");try{const[t,n]=await y(e);await t.getFileHandle(n)}catch(s){n.s11n.storeException(2,s),t=n.sq3Codes.SQLITE_IOERR}finally{R()}O("xAccess",t),I()},xClose:async function(e){const t="xClose";x(t),d.delete(e);const s=l[e];let a=0;if(T(t),s){if(delete l[e],await u(s),s.deleteOnClose)try{await s.dirHandle.removeEntry(s.filenamePart)}catch(o){i("Ignoring dirHandle.removeEntry() failure of",s,o)}}else n.s11n.serialize(),a=n.sq3Codes.SQLITE_NOTFOUND;R(),O(t,a),I()},xDelete:async function(...e){x("xDelete");const t=await L.xDeleteNoWait(...e);O("xDelete",t),I()},xDeleteNoWait:async function(e,t=0,s=!1){let a=0;T("xDelete");try{for(;e;){const[n,a]=await y(e,!1);if(!a)break;if(await n.removeEntry(a,{recursive:s}),4660!==t)break;s=!1,(e=f(e,!0)).pop(),e=e.join("/")}}catch(o){n.s11n.storeException(2,o),a=n.sq3Codes.SQLITE_IOERR_DELETE}return R(),a},xFileSize:async function(e){x("xFileSize");const t=l[e];let s=0;T("xFileSize");try{const e=await(await g(t,"xFileSize")).getSize();n.s11n.serialize(Number(e))}catch(a){n.s11n.storeException(1,a),s=w.convertRc(a,n.sq3Codes.SQLITE_IOERR)}await m(t),R(),O("xFileSize",s),I()},xLock:async function(e,t){x("xLock");const s=l[e];let a=0;const o=s.xLock;if(s.xLock=t,!s.syncHandle){T("xLock");try{await g(s,"xLock"),d.delete(e)}catch(i){n.s11n.storeException(1,i),a=w.convertRc(i,n.sq3Codes.SQLITE_IOERR_LOCK),s.xLock=o}R()}O("xLock",a),I()},xOpen:async function(e,t,s,a){const o="xOpen";x(o);const i=n.sq3Codes.SQLITE_OPEN_CREATE&s;T("xOpen");try{let c,d;try{[c,d]=await y(t,!!i)}catch(r){return n.s11n.storeException(1,r),O(o,n.sq3Codes.SQLITE_NOTFOUND),I(),void R()}if(n.opfsFlags.OPFS_UNLINK_BEFORE_OPEN&a)try{await c.removeEntry(d)}catch(r){}const f=await c.getFileHandle(d,{create:i});R();const u=Object.assign(Object.create(null),{fid:e,filenameAbs:t,filenamePart:d,dirHandle:c,fileHandle:f,sabView:n.sabFileBufView,readOnly:!i&&n.sq3Codes.SQLITE_OPEN_READONLY&s,deleteOnClose:!!(n.sq3Codes.SQLITE_OPEN_DELETEONCLOSE&s)});u.releaseImplicitLocks=a&n.opfsFlags.OPFS_UNLOCK_ASAP||n.opfsFlags.defaultUnlockAsap,l[e]=u,O(o,0)}catch(r){R(),c(o,r),n.s11n.storeException(1,r),O(o,n.sq3Codes.SQLITE_IOERR)}I()},xRead:async function(e,t,s){x("xRead");let a,o=0;const i=l[e];try{T("xRead"),a=(await g(i,"xRead")).read(i.sabView.subarray(0,t),{at:Number(s)}),R(),a<t&&(i.sabView.fill(0,a,t),o=n.sq3Codes.SQLITE_IOERR_SHORT_READ)}catch(r){void 0===a&&R(),c("xRead() failed",r,i),n.s11n.storeException(1,r),o=w.convertRc(r,n.sq3Codes.SQLITE_IOERR_READ)}await m(i),O("xRead",o),I()},xSync:async function(e,t){x("xSync");const s=l[e];let a=0;if(!s.readOnly&&s.syncHandle){try{T("xSync"),await s.syncHandle.flush()}catch(o){n.s11n.storeException(2,o),a=n.sq3Codes.SQLITE_IOERR_FSYNC}R()}O("xSync",a),I()},xTruncate:async function(e,t){x("xTruncate");let s=0;const a=l[e];T("xTruncate");try{E("xTruncate",a),await(await g(a,"xTruncate")).truncate(t)}catch(o){c("xTruncate():",o,a),n.s11n.storeException(2,o),s=w.convertRc(o,n.sq3Codes.SQLITE_IOERR_TRUNCATE)}await m(a),R(),O("xTruncate",s),I()},xUnlock:async function(e,t){x("xUnlock");let s=0;const a=l[e];if(n.sq3Codes.SQLITE_LOCK_NONE===t&&a.syncHandle){T("xUnlock");try{await u(a)}catch(o){n.s11n.storeException(1,o),s=n.sq3Codes.SQLITE_IOERR_UNLOCK}R()}O("xUnlock",s),I()},xWrite:async function(e,t,s){let a;x("xWrite");const o=l[e];T("xWrite");try{E("xWrite",o),a=t===(await g(o,"xWrite")).write(o.sabView.subarray(0,t),{at:Number(s)})?0:n.sq3Codes.SQLITE_IOERR_WRITE}catch(i){c("xWrite():",i,o),n.s11n.storeException(1,i),a=w.convertRc(i,n.sq3Codes.SQLITE_IOERR_WRITE)}await m(o),R(),O("xWrite",a),I()}},_=async function(){const t=Object.create(null);for(let e of Object.keys(n.opIds)){const s=L[e];if(!s)continue;const a=Object.create(null);t[n.opIds[e]]=a,a.key=e,a.f=s}for(;!A;)try{if("not-equal"!==Atomics.wait(n.sabOPView,n.opIds.whichOp,0,n.asyncIdleWaitTime)){await b();continue}const s=Atomics.load(n.sabOPView,n.opIds.whichOp);Atomics.store(n.sabOPView,n.opIds.whichOp,0);const a=t[s]??e("No waitLoop handler for whichOp #",s),o=n.s11n.deserialize(!0)||[];a.f?await a.f(...o):c("Missing callback for opId",s)}catch(s){c("in waitLoop():",s)}};navigator.storage.getDirectory().then((function(s){n.rootDir=s,globalThis.onmessage=function({data:s}){switch(s.type){case"opfs-async-init":{const a=s.args;for(const e in a)n[e]=a[e];n.verbose=a.verbose??1,n.sabOPView=new Int32Array(n.sabOP),n.sabFileBufView=new Uint8Array(n.sabIO,0,n.fileBufferSize),n.sabS11nView=new Uint8Array(n.sabIO,n.sabS11nOffset,n.sabS11nSize),Object.keys(L).forEach((t=>{Number.isFinite(n.opIds[t])||e("Maintenance required: missing state.opIds[",t,"]")})),(()=>{if(n.s11n)return n.s11n;const t=new TextDecoder,s=new TextEncoder("utf-8"),a=new Uint8Array(n.sabIO,n.sabS11nOffset,n.sabS11nSize),o=new DataView(n.sabIO,n.sabS11nOffset,n.sabS11nSize);n.s11n=Object.create(null);const i=Object.create(null);i.number={id:1,size:8,getter:"getFloat64",setter:"setFloat64"},i.bigint={id:2,size:8,getter:"getBigInt64",setter:"setBigInt64"},i.boolean={id:3,size:4,getter:"getInt32",setter:"setInt32"},i.string={id:4};const c=t=>{switch(t){case i.number.id:return i.number;case i.bigint.id:return i.bigint;case i.boolean.id:return i.boolean;case i.string.id:return i.string;default:e("Invalid type ID:",t)}};n.s11n.deserialize=function(e=!1){++r.s11n.deserialize.count;const s=performance.now(),i=a[0],l=i?[]:null;if(i){const e=[];let s,r,d,f=1;for(s=0;s<i;++s,++f)e.push(c(a[f]));for(s=0;s<i;++s){const i=e[s];i.getter?(d=o[i.getter](f,n.littleEndian),f+=i.size):(r=o.getInt32(f,n.littleEndian),f+=4,d=t.decode(a.slice(f,f+r)),f+=r),l.push(d)}}return e&&(a[0]=0),r.s11n.deserialize.time+=performance.now()-s,l},n.s11n.serialize=function(...t){const c=performance.now();if(++r.s11n.serialize.count,t.length){const c=[];let r=0,d=1;for(a[0]=255&t.length;r<t.length;++r,++d)c.push((l=t[r],i[typeof l]||e("Maintenance required: this value type cannot be serialized.",l))),a[d]=c[r].id;for(r=0;r<t.length;++r){const e=c[r];if(e.setter)o[e.setter](d,t[r],n.littleEndian),d+=e.size;else{const e=s.encode(t[r]);o.setInt32(d,e.byteLength,n.littleEndian),d+=4,a.set(e,d),d+=e.byteLength}}}else a[0]=0;var l;r.s11n.serialize.time+=performance.now()-c},n.s11n.storeException=n.asyncS11nExceptions?(e,t)=>{e<=n.asyncS11nExceptions&&n.s11n.serialize([t.name,": ",t.message].join(""))}:()=>{},n.s11n})(),r.reset(),o("init state",n),t("opfs-async-inited"),_();break}case"opfs-async-restart":A&&(i("Restarting after opfs-async-shutdown. Might or might not work."),A=!1,_());break;case"opfs-async-metrics":r.dump()}},t("opfs-async-loaded")})).catch((e=>c("error initializing OPFS asyncer:",e)))};globalThis.SharedArrayBuffer?globalThis.Atomics?globalThis.FileSystemHandle&&globalThis.FileSystemDirectoryHandle&&globalThis.FileSystemFileHandle&&globalThis.FileSystemFileHandle.prototype.createSyncAccessHandle&&navigator?.storage?.getDirectory?n():t("opfs-unavailable","Missing required OPFS APIs."):t("opfs-unavailable","Missing Atomics API.","The server must emit the COOP/COEP response headers to enable that."):t("opfs-unavailable","Missing SharedArrayBuffer API.","The server must emit the COOP/COEP response headers to enable that.")})();
//# sourceMappingURL=bundle.web.775.js.map