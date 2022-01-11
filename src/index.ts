/**
 * This file is just a silly example to show everything working in the browser.
 * When you're ready to start on your site, clear the file. Happy hacking!
 **/

 import confetti from 'canvas-confetti';

 confetti.create(document.getElementById('canvas') as HTMLCanvasElement, {
   resize: true,
   useWorker: true,
 })({ particleCount: 200, spread: 200 });
 
 class ADBObjectStore {
   databaseName: string;
 
   constructor(databaseName: string) {
     this.databaseName = databaseName;
   }
 
   public async createDatabase(database_schema: any, records: any): Promise<IDBOpenDBRequest> {
     const { version, objectStores } = database_schema;
 
     let request = indexedDB.open(this.databaseName, version);
     request.onupgradeneeded = (event) => {
       let db = request.result;
 
       const name = objectStores[0].name;
       const keyPath = objectStores[0].keyPath;
       const autoIncrement = objectStores[0].autoIncrement;
       const indexes = objectStores[0].indexes;
 
       let objectStore = db.createObjectStore(name, { keyPath, autoIncrement });
       indexes.forEach((index: any) =>
         objectStore.createIndex(index.name, index.keyPath, {
           multiEntry: index.multiEntry,
           unique: index.unique,
         }),
       );
 
       objectStore.transaction.oncomplete = (event) => {
         let recordObjectStore = db
           .transaction(name, 'readwrite')
           .objectStore(name);
         records.forEach((record: any) => recordObjectStore.add(record));
       };
     };
 
     return request;
   }
 }
 
 class LockHolder {
   private p: any;
   private resolve: any;
   private reject: any;
 
   constructor() {
     this.p = new Promise((resolve, reject) => {
       this.resolve = resolve;
       this.reject = reject;
     });
   }
 
   public getLockAndHold(id: string) {
     navigator.locks.request('resource', async (lock) => {
       console.log('Lock');
 
       let btn: HTMLButtonElement = <HTMLButtonElement>(
         document.createElement('button')
       );
       btn.id = id;
       btn.textContent = 'Lock Release';
       btn.addEventListener('click', (e: Event) => this.releaseLock(id));
       
       const elemId = 'container';
       let div: HTMLDivElement = <HTMLDivElement>(
         document.createElement('div')
       )
       div.id = elemId;
       document.body.appendChild(div);
 
       document.getElementById(elemId)?.append(btn);
       return this.p;
     });
   }
 
   public releaseLock(id: string) {
     this.resolve();
     console.log('Lock Release!');
 
     document.getElementById(id)?.remove();
   }
 }
 
 export { ADBObjectStore, LockHolder };
 