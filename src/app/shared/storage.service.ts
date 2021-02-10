import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: AngularFireStorage,
  ) { }

  uploadFile(filePath, file) {
    return this.storage.upload(filePath, file);
  }

  getDownloadURL(filePath) {
    return this.storage.ref(filePath).getDownloadURL();
  }

  deleteFolderContents(path, recursive=false) {
    const ref = this.storage.ref(path);
  
    ref.listAll()
      .subscribe(
        dir => {
          dir.items.forEach(fileRef => {
            this.deleteFile(path, fileRef.name);
          });
          if (recursive) {
            dir.prefixes.forEach( folderRef => {
              this.deleteFolderContents(folderRef.fullPath);
            })
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  private deleteFile(pathToFile, fileName) {
    const ref = this.storage.ref(pathToFile);
    const childRef = ref.child(fileName);
    childRef.delete();
  }

}
